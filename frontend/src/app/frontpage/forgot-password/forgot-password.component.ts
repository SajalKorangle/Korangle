import {Component, OnInit} from '@angular/core';
import {User} from '@classes/user';
import {NotificationService} from '@services/modules/notification/notification.service';
import {CommonFunctions} from '@classes/common-functions';
import {DataStorage} from '@classes/data-storage';
import {ForgotPasswordServiceAdapter} from './forgot-password.service.adapter';
import {AuthenticationService} from '@services/modules/authentication/authentication.service';
import {UserService} from '@services/modules/user/user.service';
import {VALIDATORS_REGX} from '@classes/regx-validators';
import {Router} from '@angular/router';

@Component({
    selector: 'forgot-password-component',
    providers: [NotificationService, AuthenticationService, UserService],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['../components/authentication/authentication.component.css'],
})
export class ForgotPasswordComponent implements OnInit {

    user: User;
    serviceAdapter: ForgotPasswordServiceAdapter;

    userInput = {
        mobileNumber: '',
        otp: '',
        password: '',
        confirmPassword: ''
    };

    stateKeeper = {
        isLoading: false
    };

    // section in forgot password (entering num or otp section)
    childSection = 'mobileNumber';

    passwordVisibility = false; // to toggle password visibility
    validators = VALIDATORS_REGX;


    constructor(
        public authenticationService: AuthenticationService,
        public userService: UserService,
        public notificationService: NotificationService,
        public router: Router,
    ) {
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ForgotPasswordServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
    }

    toggleVisibilityMode(): void {
        this.passwordVisibility = !this.passwordVisibility;
    }

    getVisibilityMode(): string {
        if (this.passwordVisibility) {
            return 'visibility_off';
        } else {
            return 'visibility';
        }
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    isOtpFormValid(): boolean {
        if (!this.userInput.otp || this.userInput.otp.trim().length == 0 || this.userInput.otp.trim().length != 6) {
            return false;
        } else if (!this.userInput.password || this.userInput.password.trim().length < 8) {
            return false;
        } else if (!this.userInput.confirmPassword || this.userInput.confirmPassword.trim().length < 8) {
            return false;
        }
        return true;
    }

    reTypeMobileNumber(): void {
        this.childSection = 'mobileNumber';
        this.userInput.mobileNumber = '';
        this.userInput.otp = '';
        this.userInput.password = '';
        this.userInput.confirmPassword = '';
    }
}
