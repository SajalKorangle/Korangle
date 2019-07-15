import {Component, ElementRef, Input} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../classes/user';
import {sendDataToAndroid} from "../classes/common";

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
                sendDataToAndroid(this.user.jwt);
                this.user.isAuthenticated = true;
                this.user.initializeUserData(data);
            }
        }, error => {
            this.isLoading = false;
        });
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