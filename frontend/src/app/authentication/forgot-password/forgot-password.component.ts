import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User } from '@classes/user';
import { NotificationService } from '@services/modules/notification/notification.service';
import { CommonFunctions } from '@classes/common-functions';
import { DataStorage } from '@classes/data-storage';
import { ForgotPasswordServiceAdapter } from './forgot-password.service.adapter';
import { AuthenticationService } from '@services/modules/authentication/authentication.service';
import { UserService } from '@services/modules/user/user.service';
import { VALIDATORS_REGX } from '@classes/regx-validators';
import { Query } from '@services/generic/query';

@Component({
    selector: 'app-forgot-password',
    providers: [NotificationService, AuthenticationService, UserService],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
    @Input() chosenComponent;

    user: User;

    @Output() showFrontPageProgressBar = new EventEmitter();
    @Output() changePage = new EventEmitter();

    mobileNumber: string = '';
    otp = '';
    password = '';
    confirmPassword = '';

    section = 'mobileNumber';

    visibilityMode = false;

    validators = VALIDATORS_REGX;

    isLoading = false;

    signOutFromAll = false;

    serviceAdapter: ForgotPasswordServiceAdapter;

    constructor(
        public authenticationService: AuthenticationService,
        public userService: UserService,
        public notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ForgotPasswordServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
    }

    toggleVisibilityMode(): void {
        this.visibilityMode = !this.visibilityMode;
    }

    getVisibilityMode(): string {
        if (this.visibilityMode) {
            return 'visibility_off';
        } else {
            return 'visibility';
        }
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    isMobileNumberValid(): boolean {
        return this.validators.phoneNumber.test(this.mobileNumber);
    }

    isOtpFormValid() {
        if (!this.otp || this.otp.trim().length == 0) {
            return false;
        } else if (!this.password || this.password.trim().length < 8) {
            return false;
        } else if (!this.confirmPassword || this.confirmPassword.trim().length < 8) {
            return false;
        }
        return true;
    }

    reTypeMobileNumber() {
        this.section = 'mobileNumber';
        this.mobileNumber = '';
        this.otp = '';
        this.password = '';
        this.confirmPassword = '';
    }
}
