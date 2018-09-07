import {Component, ElementRef, Input} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
// import {Router} from "@angular/router";
import { User } from '../classes/user';

@Component({
    selector: 'app-login-form',
    providers: [AuthenticationService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})

export class LoginComponent {

    @Input() user: User;
    public errorMsg = '';
    username = '';
    password = '';
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
                this.user.isAuthenticated = true;
                this.user.initializeUserData(data);
            }
        });
    }

}