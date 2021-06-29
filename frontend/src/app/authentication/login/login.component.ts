import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthenticationOldService } from '@services/authentication-old.service';
import { User } from '@classes/user';
import { registerForNotification } from '@classes/common.js';
import { NotificationService } from '@services/modules/notification/notification.service';
import { Constants } from '@classes/constants';
import { environment } from '../../../environments/environment';
import { CommonFunctions } from '@classes/common-functions';
import { DataStorage } from '@classes/data-storage';
import { VALIDATORS_REGX } from '@classes/regx-validators';

@Component({
    selector: 'app-login',
    providers: [AuthenticationOldService, NotificationService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    user: User;

    @Output() showFrontPageProgressBar = new EventEmitter();
    @Output() changePage = new EventEmitter();

    username = '';
    password = '';
    visibilityMode = false;

    validators = VALIDATORS_REGX;

    isLoading = false;

    constructor(private authenticationService: AuthenticationOldService, private notificationService: NotificationService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    login() {
        this.isLoading = true;
        this.authenticationService.loginUserDetails(this.username, this.password).then(
            (data) => {
                this.isLoading = false;
                this.showFrontPageProgressBar.emit('false');
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
                this.showFrontPageProgressBar.emit('false');
                this.isLoading = false;
            }
        );
    }

    submit() {
        const elem = document.getElementById('username');
        if (document.activeElement === elem) {
            document.getElementById('pass').focus();
        } else {
            this.showFrontPageProgressBar.emit('true');
            this.login();
        }
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
        return this.validators.phoneNumber.test(this.username);
    }
}
