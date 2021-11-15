import {Component, OnInit} from '@angular/core';
import {CommonFunctions} from '@classes/common-functions';
import {VALIDATORS_REGX} from '@classes/regx-validators';
import {DataStorage} from '@classes/data-storage';
import {User} from '@classes/user';
import {registerForNotification} from '@classes/common';
import {environment} from '../../environments/environment';
import {Constants} from '@classes/constants';
import {AuthenticationOldService} from '@services/authentication-old.service';
import {NotificationService} from '@services/modules/notification/notification.service';


@Component({
    selector: 'app-frontpage2',
    templateUrl: './frontpage2.component.html',
    styleUrls: ['./frontpage2.component.css']
})
export class Frontpage2Component implements OnInit {

    section = 'normal';
    user: User;

    loginVariables = {
        mobileNumber: '',
        password: '',
        passwordVisibility: false
    };

    forgotPasswordVariables = {
        mobileNumber: null,
        otp: '',
        newPassword: null,
        confirmPassword: null,
        newPasswordVisibility: false,
        confirmPasswordVisibility: false
    };

    signUpVariables = {
        firstName: null,
        lastName: null,
        emailID: null,
        mobileNumber: null,
        otp: '',
        newPassword: null,
        confirmPassword: null,
        newPasswordVisibility: false,
        confirmPasswordVisibility: false
    };

    validators = VALIDATORS_REGX;

    isLoading = false;

    changePassword = false;
    path = window.location.pathname;

    constructor(private authenticationService: AuthenticationOldService, private notificationService: NotificationService) {
    }


    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    login() {
        this.isLoading = true;
        this.authenticationService.loginUserDetails(this.loginVariables.mobileNumber, this.loginVariables.password).then(
            (data) => {
                this.isLoading = false;
                if (data.username === 'invalidUsername') {
                    alert('Login failed: Invalid username or password');
                } else {
                    localStorage.setItem('schoolJWT', data.token);
                    this.user.jwt = data.token;
                    this.user.isAuthenticated = true;
                    this.user.initializeUserData(data);
                    //Sending the user-id of user to google-analytics to monitor per user flow
                    // (<any>window).ga('set', 'userId', 'id: '+data.id+' user-name: '+data.username+ ' name: '+data.first_name+' '+data.last_name);
                    (<any>window).ga('set', 'userId', 'id: ' + data.id);
                    (<any>window).ga('send', 'event', 'authentication', 'Login');
                    registerForNotification({
                        user: this.user.id,
                        jwt: this.user.jwt,
                        url:
                            environment.DJANGO_SERVER +
                            Constants.api_version +
                            this.notificationService.module_url +
                            this.notificationService.gcm_device,
                    });
                }
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    submit() {
        const elem = document.getElementById('username');
        if (document.activeElement === elem) {
            document.getElementById('pass').focus();
        } else {
            this.login();
        }
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    onOtpChange(event) {
        console.log(event);
    }

    toggleVisibilityMode(visibilityMode): void {
        visibilityMode = !visibilityMode;
    }

    getVisibilityMode(visibilityMode): string {
        if (visibilityMode) {
            return 'visibility_off';
        } else {
            return 'visibility';
        }
    }

}
