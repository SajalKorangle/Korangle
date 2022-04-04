import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonFunctions} from '@classes/common-functions';
import {VALIDATORS_REGX} from '@classes/regx-validators';
import {AuthenticationOldService} from '@services/authentication-old.service';
import {NotificationService} from '@services/modules/notification/notification.service';
import {AuthenticationService} from '@services/modules/authentication/authentication.service';
import {DataStorage} from '@classes/data-storage';
import {CreateSchoolServiceAdapter} from './create-school.service.adapter';
import {User} from '@classes/user';
import {UserService} from '@services/modules/user/user.service';
import {SchoolService} from '@services/modules/school/school.service';
import {MEDIUM_LIST} from '@classes/constants/medium';
import {Router} from '@angular/router';

@Component({
    selector: 'create-school-component',
    templateUrl: './create-school.component.html',
    providers: [AuthenticationOldService, NotificationService, AuthenticationService, SchoolService, UserService],
    styleUrls: ['../components/contact-us-create-school/contact-us-create-school.component.css', './create-school.component.css']
})
export class CreateSchoolComponent implements OnInit {

    @Output() showFrontPageProgressBar = new EventEmitter();

    user: User;
    serviceAdapter: CreateSchoolServiceAdapter;

    mediumList = MEDIUM_LIST;
    validators = VALIDATORS_REGX;

    // user detail variables
    userDetails = {
        mobileNumber: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        emailId: null
    };

    // school detail variables
    schoolDetails = {
        shortName: '',
        fullName: '',
        headerSize: '',
        parentBoard: 2, // C.B.S.E Board
        medium: this.mediumList[0],
        currentSession: 3,
        address: ''
    };

    stateKeeper = {
        isOTPSending: false,
        isLoading: false,
    };

    otp = '';
    otpSent = false; // to check whether the otp has sent
    userAlreadyExists = false; // to check user Already exists ( to toggle btw login and signup after creation)

    passwordVisibility = false;
    confirmPasswordVisibility = false;

    constructor(public authenticationOldService: AuthenticationOldService,
                public notificationService: NotificationService,
                public authenticationNewService: AuthenticationService,
                public userService: UserService,
                public schoolService: SchoolService,
                public router: Router) {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new CreateSchoolServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    isSendOTPDisabled() {
        return !this.validators.phoneNumber.test(this.userDetails.mobileNumber) || this.stateKeeper.isOTPSending;
    }

    isCreateDisabled() {
        return !this.validators.phoneNumber.test(this.userDetails.mobileNumber) ||
            this.userDetails.firstName.trim().length < 2 || this.userDetails.lastName.trim().length < 2 ||
            this.schoolDetails.fullName.trim().length < 2 || this.schoolDetails.shortName.trim().length < 2 || !this.otpSent ||
            this.stateKeeper.isOTPSending || this.otp.trim().length != 6 || !this.validators.password.test(this.userDetails.password) ||
            (!this.userAlreadyExists && !this.validators.password.test(this.userDetails.confirmPassword));
    }

    getOTPButtonText() {
        if (!this.stateKeeper.isOTPSending) {
            return this.otpSent ? 'Resend OTP' : 'Send OTP';
        }
        return 'Sending...';
    }

    getVisibilityMode(visibilityMode): string {
        if (visibilityMode) {
            return 'visibility_off';
        } else {
            return 'visibility';
        }
    }

}
