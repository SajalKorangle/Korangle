import { ForgotPasswordComponent } from './forgot-password.component';
import { load } from 'recaptcha-v3';

export class ForgotPasswordServiceAdapter {
    vm: ForgotPasswordComponent;
    recaptcha: any;

    constructor() {}

    // Data

    initializeAdapter(vm: ForgotPasswordComponent): void {
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
        this.vm.authenticationService.generateOTP({ mobileNumber: this.vm.mobileNumber, captchaToken: token }).then(
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
            alert('New Password and confirm password are not same');
            return;
        }

        // Code Review
        // Is this going to be called if we are already checking this.otp in isOtpFormValid? -- yes, it was merged along with Shivam's code
        // Removed it , as we are already checking in the isOtpFormValid function

        // Code Review
        // Is this going to be called if we are already checking this.otp in isOtpFormValid?
        // Removed it , as we are already checking in the isOtpFormValid function

        this.vm.isLoading = true;
        this.vm.showFrontPageProgressBar.emit('true');
        this.vm.authenticationService
            .verifyOTP({
                mobileNumber: this.vm.mobileNumber,
                otp: this.vm.otp,
                password: this.vm.password,
            })
            .then(
                (otpResponse) => {
                    if (otpResponse.status === 'success') {
                        this.vm.isLoading = false;
                        this.vm.showFrontPageProgressBar.emit('false');
                        alert('Password changed successfully');
                        this.vm.changePage.emit('login');
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
