import {registerForNotification} from '@classes/common';
import {environment} from '../../../environments/environment';
import {Constants} from '@classes/constants';
import {load} from 'recaptcha-v3';
import {LoginSignupComponent} from './login-signup.component';

export class LoginSignupServiceAdapter {
    vm: LoginSignupComponent;
    recaptcha: any;

    constructor() {
    }

    // Data

    initializeAdapter(vm: LoginSignupComponent): void {
        this.vm = vm;
        load('6LdNiNgZAAAAAMl0OzvNQgutLvXll5uDfMC0nj2c').then((recaptcha) => {
            this.recaptcha = recaptcha;
        });
    }

    // initialize data
    initializeData(): void {
    }

    // -------- Login Section Starts --------
    async login() {
        this.vm.stateKeeper.isLoading = true;
        const loginData = await this.vm.authenticationOldService.loginUserDetails(this.vm.loginVariables.mobileNumber, this.vm.loginVariables.password);
        if (loginData.username === 'invalidUsername') {
            alert('Login failed: Invalid username or password');
        } else {
            localStorage.setItem('schoolJWT', loginData.token);
            this.vm.user.jwt = loginData.token;
            this.vm.user.isAuthenticated = true;
            this.vm.user.initializeUserData(loginData);
            //Sending the user-id of user to google-analytics to monitor per user flow
            // (<any>window).ga('set', 'userId', 'id: '+data.id+' user-name: '+data.username+ ' name: '+data.first_name+' '+data.last_name);
            (<any>window).ga('set', 'userId', 'id: ' + loginData.id);
            (<any>window).ga('send', 'event', 'authentication', 'Login');
            registerForNotification({
                user: this.vm.user.id,
                jwt: this.vm.user.jwt,
                url:
                    environment.DJANGO_SERVER +
                    Constants.api_version +
                    this.vm.notificationService.module_url +
                    this.vm.notificationService.gcm_device,
            });
            this.vm.router.navigate([Constants.dashBoardRoute]);
            this.vm.stateKeeper.isLoading = false;
        }
        this.vm.stateKeeper.isLoading = false;
    }

    // -------- Login Section Ends --------

    // -------- Sign-up Section Starts --------
    submitCaptcha() {
        this.vm.signUpVariables.isOTPSending = true;
        this.recaptcha.execute('submit').then(async (token) => {
            await this.generateOTP(token);
        });
    }

    // ------ Generation of OTP -------
    async generateOTP(token) {
        const responseData = await this.vm.authenticationNewService.generateOTP({
            mobileNumber: this.vm.signUpVariables.mobileNumber,
            captchaToken: token,
            action: 'SIGN UP'
        });
        this.vm.signUpVariables.isOTPSending = false;
        if (responseData.status === 'success') {
            alert('OTP Sent Successfully');
            this.vm.signUpVariables.otpSent = true;
        } else if (responseData.status === 'failure') {
            alert(responseData.message);
            this.vm.signUpVariables.otpSent = false;
        }
    }

    // ------ Verification of otp ------
    async verifyOTP() {
        if (this.vm.signUpVariables.firstName.trim() === '' || this.vm.signUpVariables.lastName.trim() === '') {
            alert('Please fill your name');
            return;
        }
        if (this.vm.signUpVariables.password !== this.vm.signUpVariables.confirmPassword) {
            alert('Password and confirm password are not same');
            return;
        }
        this.vm.stateKeeper.isLoading = true;
        const otpResponse = await this.vm.authenticationNewService
            .verifyOTPAndSignup({
                first_name: this.vm.signUpVariables.firstName,
                last_name: this.vm.signUpVariables.lastName,
                mobileNumber: this.vm.signUpVariables.mobileNumber,
                email: this.vm.signUpVariables.emailID,
                otp: this.vm.signUpVariables.otp,
                password: this.vm.signUpVariables.password,
            });
        if (otpResponse.status === 'success') {
            const loginData = await this.vm.authenticationOldService.loginUserDetails(this.vm.signUpVariables.mobileNumber, this.vm.signUpVariables.password);
            if (loginData.username === 'invalidUsername') {
                alert('Login failed: Invalid username or password');
            } else {
                localStorage.setItem('schoolJWT', loginData.token);
                this.vm.user.jwt = loginData.token;
                this.vm.user.isAuthenticated = true;
                this.vm.user.initializeUserData(loginData);
                registerForNotification({
                    user: this.vm.user.id,
                    jwt: this.vm.user.jwt,
                    url:
                        environment.DJANGO_SERVER +
                        Constants.api_version +
                        this.vm.notificationService.module_url +
                        this.vm.notificationService.gcm_device,
                });
            }
            await this.vm.router.navigate([Constants.dashBoardRoute + '/notification/view_notification']);
        } else if (otpResponse.status === 'failure') {
            alert(otpResponse.message);
        }
        this.vm.stateKeeper.isLoading = false;
    }
    // -------- Sign-up Section Ends --------
}
