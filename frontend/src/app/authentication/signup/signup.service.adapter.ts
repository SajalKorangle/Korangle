import { SignupComponent } from './signup.component';
import { registerForNotification } from '@classes/common';
import { environment } from '../../../environments/environment';
import { Constants } from '@classes/constants';
import { load } from 'recaptcha-v3';

export class SignupServiceAdapter {
    vm: SignupComponent;
    recaptcha: any;

    constructor() {}

    // Data

    initializeAdapter(vm: SignupComponent): void {
        this.vm = vm;
        load('6LdNiNgZAAAAAMl0OzvNQgutLvXll5uDfMC0nj2c').then((recaptcha) => {
            this.recaptcha = recaptcha;
        });
    }

    // initialize data
    initializeData(): void {}

    submitCaptcha() {
        this.vm.isLoading = true;
        this.vm.showFrontPageProgressBar.emit('true');
        this.recaptcha.execute('submit').then((token) => {
            this.generateOTP(token);
        });
    }

    generateOTP(token) {
        this.vm.authenticationService.generateOTPForSignup({ mobileNumber: this.vm.mobileNumber, captchaToken: token }).then(
            (data) => {
                this.vm.isLoading = false;
                this.vm.showFrontPageProgressBar.emit('false');
                if (data.status === 'success') {
                    this.vm.section = 'otp';
                } else if (data.status === 'failure') {
                    alert(data.message);
                }
            },
            (error) => {
                this.vm.isLoading = false;
                this.vm.showFrontPageProgressBar.emit('false');
            }
        );
    }

    verifyOTP() {
        if (this.vm.password !== this.vm.confirmPassword) {
            alert('Password and confirm password are not same');
            return;
        }

        this.vm.isLoading = true;
        this.vm.showFrontPageProgressBar.emit('true');
        this.vm.authenticationService
            .verifyOTPForSignup({
                first_name: this.vm.firstName,
                last_name: this.vm.lastName,
                mobileNumber: this.vm.mobileNumber,
                email: this.vm.emailAddress,
                otp: this.vm.otp,
                password: this.vm.password,
            })
            .then(
                (otpResponse) => {
                    console.log(otpResponse);
                    if (otpResponse.status === 'success') {
                        this.vm.authenticationOldService.loginUserDetails(this.vm.mobileNumber, this.vm.password).then(
                            (data) => {
                                this.vm.isLoading = false;
                                this.vm.showFrontPageProgressBar.emit('false');
                                if (data.username === 'invalidUsername') {
                                    alert('Login failed: Invalid username or password');
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
                                }
                            },
                            (error) => {
                                this.vm.showFrontPageProgressBar.emit('false');
                                this.vm.isLoading = false;
                            }
                        );
                    } else if (otpResponse.status === 'failure') {
                        this.vm.isLoading = false;
                        this.vm.showFrontPageProgressBar.emit('false');
                        alert(otpResponse.message);
                    }
                },
                (error) => {
                    this.vm.isLoading = false;
                    this.vm.showFrontPageProgressBar.emit('false');
                }
            );
    }
}
