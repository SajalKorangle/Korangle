import {ForgotPasswordComponent} from './forgot-password.component';
import {load} from 'recaptcha-v3';

export class ForgotPasswordServiceAdapter {
    vm: ForgotPasswordComponent;
    recaptcha: any;

    constructor() {
    }

    initializeAdapter(vm: ForgotPasswordComponent): void {
        this.vm = vm;
        load('6LdNiNgZAAAAAMl0OzvNQgutLvXll5uDfMC0nj2c').then((recaptcha) => {
            this.recaptcha = recaptcha;
        });
    }

    // initialize data
    initializeData(): void {
    }

    // ----  Generation of OTP Starts ----
    submitCaptcha(): void {
        this.vm.stateKeeper.isLoading = true;
        this.recaptcha.execute('submit').then((token) => {
            this.generateOTP(token);
        });
    }

    generateOTP(token): void {
        this.vm.authenticationService.generateOTP({
            mobileNumber: this.vm.userInput.mobileNumber,
            captchaToken: token,
            action: 'FORGOT PASSWORD'
        }).then(
            (data) => {
                this.vm.stateKeeper.isLoading = false;
                if (data.status === 'success') {
                    this.vm.childSection = 'otp';
                } else if (data.status === 'failure') {
                    alert(data.message);
                }
            },
            (error) => {
                this.vm.stateKeeper.isLoading = false;
            }
        );
    }
    // ----  Generation of OTP Ends ----

    // --- Verification of the OTP provided Starts ---
    verifyOTP(): void {
        if (this.vm.userInput.password !== this.vm.userInput.confirmPassword) {
            alert('New Password and confirm password are not same');
            return;
        }

        this.vm.stateKeeper.isLoading = true;
        this.vm.authenticationService
            .verifyOTPAndChangePassword({
                mobileNumber: this.vm.userInput.mobileNumber,
                otp: this.vm.userInput.otp,
                password: this.vm.userInput.password,
            })
            .then(
                (otpResponse) => {
                    if (otpResponse.status === 'success') {
                        this.vm.stateKeeper.isLoading = false;
                        alert('Password changed successfully');
                    } else if (otpResponse.status === 'failure') {
                        this.vm.stateKeeper.isLoading = false;
                        alert(otpResponse.message);
                    }
                },
                (error) => {
                    this.vm.stateKeeper.isLoading = false;
                }
            );
    }
    // --- Verification of the OTP provided Ends ---
}
