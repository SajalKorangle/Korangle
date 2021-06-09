import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User } from '@classes/user';
import { NotificationService } from '@services/modules/notification/notification.service';
import { CommonFunctions } from '@classes/common-functions';
import { DataStorage } from '@classes/data-storage';
import { SignupServiceAdapter } from './signup.service.adapter';
import { AuthenticationService } from '@services/modules/authentication/authentication.service';
import { AuthenticationOldService } from '@services/authentication-old.service';
import { UserService } from '@services/modules/user/user.service';
import { VALIDATORS_REGX } from '@classes/regx-validators';

@Component({
    selector: 'app-signup',
    providers: [NotificationService, AuthenticationService, AuthenticationOldService, UserService],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
    @Input() chosenComponent;

    user: User;

    @Output() showFrontPageProgressBar = new EventEmitter();
    @Output() changePage = new EventEmitter();

    firstName = '';
    lastName = '';
    mobileNumber = '';
    emailAddress = '';
    otp = '';
    password = '';
    confirmPassword = '';

    section = 'userDetails';

    visibilityMode = false;

    isLoading = false;

    validators = VALIDATORS_REGX;

    serviceAdapter: SignupServiceAdapter;

    constructor(
        public authenticationService: AuthenticationService,
        public authenticationOldService: AuthenticationOldService,
        public userService: UserService,
        public notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new SignupServiceAdapter();
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

    isFormValid(): boolean {
        if (!this.validators.phoneNumber.test(this.mobileNumber)) {
            return false;
        } else if (!this.firstName || !this.validators.name.test(this.firstName)) {
            return false;
        } else if (this.lastName && !this.validators.name.test(this.lastName)) {
            return false;
        } else if (this.emailAddress && !this.validators.email.test(this.emailAddress)) {
            return false;
        }
        return true;
    }
}
