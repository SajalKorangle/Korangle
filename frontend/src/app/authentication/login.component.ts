import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../classes/user';
import {registerForNotification} from "../classes/common.js";
import {NotificationService} from "../services/modules/notification/notification.service";
import {Constants} from "../classes/constants";
import {environment} from "../../environments/environment";
import {CommonFunctions} from "../classes/common-functions";
import {DataStorage} from '@classes/data-storage';

@Component({
    selector: 'app-login-form',
    providers: [AuthenticationService, NotificationService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

    user: User;

    @Output() showFrontPageProgressBar = new EventEmitter();

    username = '';
    password = '';
    visibilityMode = false;
    isLoading = false;

    constructor(private authenticationService: AuthenticationService,
                private notificationService: NotificationService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    login() {
        this.isLoading = true;
        this.authenticationService.loginUserDetails(this.username, this.password).then( data => {
            this.isLoading = false;
            this.showFrontPageProgressBar.emit('false');
            if (data.username === 'invalidUsername') {
                alert('Login failed: Invalid username or password');

            } else {
                localStorage.setItem('schoolJWT', data.token);
                this.user.jwt = data.token;
                this.user.isAuthenticated = true;
                this.user.initializeUserData(data);
                registerForNotification({
                    'user': this.user.id,
                    'jwt': this.user.jwt,
                    'url': environment.DJANGO_SERVER + Constants.api_version + this.notificationService.module_url + this.notificationService.gcm_device,
                });
            }
        }, error => {
            this.showFrontPageProgressBar.emit('false');
            this.isLoading = false;
        });
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
            return "visibility_off";
        } else {
            return "visibility";
        }
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

}
