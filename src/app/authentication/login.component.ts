import {Component, Input, Output, EventEmitter} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../classes/user';
import {registerForNotification} from "../classes/common.js";
import {NotificationService} from "../services/modules/notification/notification.service";
import {Constants} from "../classes/constants";
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-login-form',
    providers: [AuthenticationService, NotificationService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})

export class LoginComponent {

    @Input() user: User;

    @Output() valueChange = new EventEmitter();

    username = '';
    password = '';
    visibilityMode = false;
    isLoading = false;

    constructor(private authenticationService: AuthenticationService,
                private notificationService: NotificationService) {}

    login() {
        this.isLoading = true;
        this.authenticationService.loginUserDetails(this.username, this.password).then( data => {
            this.isLoading = false;
            this.valueChange.emit('false');
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
            this.isLoading = false;
        });
    }

    submit() {
        var elem = document.getElementById('username')
        if (document.activeElement === elem) {
            document.getElementById('pass').focus()
        }
        else {
            this.valueChange.emit('true');
            this.login()
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

}