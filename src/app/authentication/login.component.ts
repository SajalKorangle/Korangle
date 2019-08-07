import {Component, Input} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../classes/user';
import {sendDataToAndroid} from "../classes/common";
import {Constants} from "../classes/constants";
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-login-form',
    providers: [AuthenticationService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})

export class LoginComponent {

    @Input() user: User;
    username = '';
    password = '';
    visibilityMode = false;
    isLoading = false;

    constructor(private authenticationService: AuthenticationService) {}

    login() {
        this.isLoading = true;
        this.authenticationService.loginUserDetails(this.username, this.password).then( data => {
            this.isLoading = false;
            if (data.username === 'invalidUsername') {
                alert('Login failed: Invalid username or password');
            } else {
                localStorage.setItem('schoolJWT', data.token);
                this.user.jwt = data.token;
                // sendDataToAndroid(this.user.jwt);
                registerForNotification({
                    'user': this.user.id,
                    'jwt': this.user.jwt,
                    'url': environment.DJANGO_SERVER + Constants.api_version + '/notification/gcm-devices'
                });
                this.user.isAuthenticated = true;
                this.user.initializeUserData(data);
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