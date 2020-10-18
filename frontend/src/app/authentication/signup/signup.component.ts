import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { User } from '@classes/user';
import {NotificationService} from '@services/modules/notification/notification.service';
import {CommonFunctions} from '@classes/common-functions';
import {DataStorage} from '@classes/data-storage';
import {SignupServiceAdapter} from './signup.service.adapter';
import {AuthenticationService} from '@services/modules/authentication/authentication.service';
import {AuthenticationOldService} from '@services/authentication-old.service';
import {UserService} from '@services/modules/user/user.service';
import {FormControl, FormGroup} from '@angular/forms';

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

    firstName: any;
    lastName: any;
    mobileNumber: any;
    emailAddress: any;
    otp = '';
    password = '';
    confirmPassword = '';

    section = 'userDetails';

    visibilityMode = false;

    myGroup;

    isLoading = false;

    serviceAdapter: SignupServiceAdapter;

    constructor(public authenticationService: AuthenticationService,
                public authenticationOldService: AuthenticationOldService,
                public userService: UserService,
                public notificationService: NotificationService) {}

    ngOnInit(): void {
        this.myGroup = new FormGroup({
            recaptchaReactive: new FormControl()
        });
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
        if (isNaN(this.mobileNumber) ||
            this.mobileNumber.toString().length !== 10 ||
            this.mobileNumber < 0 ||
            this.mobileNumber.toString().indexOf('.') !== -1) {
            // alert('Invalid Mobile Number');
            return false;
        } else if (!this.firstName ||
            this.firstName.toString().length < 2) {
            return false;
        }
        return true;
    }

}
