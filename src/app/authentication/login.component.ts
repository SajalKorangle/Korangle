import {Component, ElementRef, Input} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service'
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

    constructor(private _service: AuthenticationService) {}

    login() {
        // alert('login called');
        /*if (!this._service.loginUserDetails(this.username, this.password)) {
        // if (!this._service.login(this.username, this.password)) {
            this.errorMsg = 'Failed to login';
        }
        else {
            // router to redirect
            this.router.navigate(['/students']);
        }*/
        this._service.loginUserDetails(this.username, this.password).then( data => {
            if (data.username === 'invalidUsername') {
                alert('Login failed');
            } else {
                localStorage.setItem('schoolJWT', data.token);
                this.user.jwt = data.token;
                this.user.isAuthenticated = true;
                this.user.initializeUser(data);
            }
        });
    }

}