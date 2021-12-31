import {registerForNotification} from '@classes/common';
import {environment} from '../../../environments/environment';
import {Constants} from '@classes/constants';
import {load} from 'recaptcha-v3';
import {CreateSchoolComponent} from './create-school.component';


export class CreateSchoolServiceAdapter {
    vm: CreateSchoolComponent;
    recaptcha: any;

    constructor() {
    }

    initializeAdapter(vm: CreateSchoolComponent): void {
        this.vm = vm;
        load('6LdNiNgZAAAAAMl0OzvNQgutLvXll5uDfMC0nj2c').then((recaptcha) => {
            this.recaptcha = recaptcha;
        });
    }

    // ---- Generation of OTP Starts -----
    submitCaptcha() {
        this.vm.stateKeeper.isOTPSending = true;
        this.recaptcha.execute('submit').then((token) => {
            this.generateOTP(token);
        });
    }

    generateOTP(token) {
        this.vm.authenticationNewService.generateOTP({
            mobileNumber: this.vm.userDetails.mobileNumber,
            captchaToken: token,
            action: 'CREATE SCHOOL'
        }).then(
            (data) => {
                if (data.status === 'success') {
                    alert('OTP Sent Successfully');
                    this.vm.otpSent = true;
                    this.checkUserExists(data);
                } else if (data.status === 'failure') {
                    alert(data.message);
                    this.vm.otpSent = false;
                    this.vm.stateKeeper.isOTPSending = false;
                }
            },
            (error) => {
                this.vm.stateKeeper.isOTPSending = false;
                this.vm.otpSent = false;
            }
        );
    }

    // ---- Generation of OTP Ends -----

    // --- checking user already exists ---
    private checkUserExists(data) {
        if (data.existingUser) {
            this.vm.userAlreadyExists = true;
            this.vm.userDetails.firstName = data.existingUser.first_name;
            this.vm.userDetails.lastName = data.existingUser.last_name;
            this.vm.userDetails.emailId = data.existingUser.email;
        }
        this.vm.stateKeeper.isOTPSending = false;
    }

    // ----- Creation of School and Employee of the school Starts ---
    async createSchool() {
        this.vm.stateKeeper.isLoading = true;
        if (!this.vm.userAlreadyExists && this.vm.userDetails.password !== this.vm.userDetails.confirmPassword) {
            alert('Password and confirm password are not same');
            return;
        }

        let school_details = {
            name: this.vm.schoolDetails.shortName,
            printName: this.vm.schoolDetails.fullName,
            address: this.vm.schoolDetails.address ? this.vm.schoolDetails.address : '-',
            mobileNumber: this.vm.userDetails.mobileNumber,
            medium: this.vm.schoolDetails.medium,
            parentBoard: this.vm.schoolDetails.parentBoard,
            primaryThemeColor: 'green',
            secondaryThemeColor: 'warning',
            currentSession: 3
        };

        if (school_details.printName && school_details.printName.length > 15) {
            school_details['headerSize'] = 'BIG';
        } else {
            school_details['headerSize'] = 'SMALL';
        }

        let verify_create_school_otp = {
            first_name: this.vm.userDetails.firstName,
            last_name: this.vm.userDetails.lastName,
            mobileNumber: this.vm.userDetails.mobileNumber,
            email: this.vm.userDetails.emailId,
            otp: this.vm.otp,
            password: this.vm.userDetails.password,
            userExists: this.vm.userAlreadyExists,
            schoolDetails: school_details
        };

        // verifyOtpAndCreateSchool function process (in Backend) :
        // 1. validates otp
        // 2. validates password if user already exists (or) creates user if user doesn't exists
        // 3. Creates School, Employee and employee permissions for the user
        const otpResponse = await this.vm.authenticationNewService.verifyOTPAndCreateSchool(verify_create_school_otp);
        if (otpResponse.status === 'success') {
            this.vm.authenticationOldService.loginUserDetails(this.vm.userDetails.mobileNumber, this.vm.userDetails.password).then(
                (data) => {
                    this.vm.stateKeeper.isLoading = false;
                    if (data.username === 'invalidUsername') {
                        alert('Login failed: Invalid password');
                    } else {
                        localStorage.setItem('schoolJWT', data.token);
                        this.vm.user.jwt = data.token;
                        this.vm.user.isAuthenticated = true;
                        this.vm.user.initializeUserData(data);
                        registerForNotification({
                            user: this.vm.user.id,
                            jwt: this.vm.user.jwt,
                            url:
                                environment.DJANGO_SERVER +
                                Constants.api_version +
                                this.vm.notificationService.module_url +
                                this.vm.notificationService.gcm_device,
                        });
                        alert('School Created Successfully');
                        this.vm.router.navigate([Constants.dashBoardRoute]);
                    }
                },
                (error) => {
                    this.vm.stateKeeper.isLoading = false;
                }
            );
        } else if (otpResponse.status === 'failure') {
            alert(otpResponse.message);
            // Possible failure Messages :
            // 1. OTP verification failed
            // 2. Invalid Password ( If user exists already )
            this.vm.stateKeeper.isLoading = false;
        }
    }
    // ----- Creation of School and Employee of the school Ends ---
}
