import {Component, OnInit} from '@angular/core';
import {AuthenticationOldService} from '@services/authentication-old.service';
import {User} from '@classes/user';
import {NotificationService} from '@services/modules/notification/notification.service';
import {CommonFunctions} from '@classes/common-functions';
import {DataStorage} from '@classes/data-storage';
import {VALIDATORS_REGX} from '@classes/regx-validators';
import {LoginSignupServiceAdapter} from './login-signup.service.adapter';
import {AuthenticationService} from '@services/modules/authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'login-signup',
    providers: [AuthenticationOldService, NotificationService, AuthenticationService],
    templateUrl: './login-signup.component.html',
    styleUrls: ['../components/authentication/authentication.component.css'],
})
export class LoginSignupComponent implements OnInit {

    user: User;
    serviceAdapter: LoginSignupServiceAdapter;

    selectedSectionTabIndex = 0; // To select login or signup tab index (0-login) (1-signup)
    validators = VALIDATORS_REGX;

    // variables used for login
    loginVariables = {
        mobileNumber: '',
        password: '',
        passwordVisibility: false
    };

    // variables used for signUp
    signUpVariables = {
        firstName: '',
        lastName: '',
        emailID: '',
        mobileNumber: '',
        otp: '',
        password: '',
        confirmPassword: '',
        passwordVisibility: false,
        confirmPasswordVisibility: false,
        otpSent: false,
        isOTPSending: false
    };

    stateKeeper = {
        isLoading: false
    };

    constructor(public router: Router,
                public authenticationOldService: AuthenticationOldService,
                public notificationService: NotificationService,
                public authenticationNewService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new LoginSignupServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        // if path is sign up then 1 (signup is selected) else 0 (login is selected)
        this.selectedSectionTabIndex = window.location.pathname == '/sign-up' ? 1 : 0;
    }

    getVisibilityMode(visibilityMode): string {
        if (visibilityMode) {
            return 'visibility_off';
        } else {
            return 'visibility';
        }
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    isLoginDisabled() {
        return this.loginVariables.mobileNumber.trim().length < 10 || this.loginVariables.password.trim() == '';
    }

    getOTPButtonText() {
        if (!this.signUpVariables.isOTPSending) {
            return this.signUpVariables.otpSent ? 'Resend OTP' : 'Send OTP';
        }
        return 'Sending...';
    }

    isOTPButtonDisabled() {
        return !this.validators.phoneNumber.test(this.signUpVariables.mobileNumber) || this.signUpVariables.isOTPSending;
    }

    isSignUpDisabled() {
        if (this.signUpVariables.firstName.trim() === '' || this.signUpVariables.lastName.trim() === '') {
            return true;
        }
        if (this.signUpVariables.password.trim() === '' || this.signUpVariables.confirmPassword.trim() === '' || this.signUpVariables.otp.trim().length != 6) {
            return true;
        }
        return this.isOTPButtonDisabled();
    }
}
