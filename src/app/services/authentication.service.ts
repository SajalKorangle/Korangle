import {Injectable} from '@angular/core';

import { Headers, Http } from '@angular/http';

import { Constants } from '../classes/constants';



@Injectable()
export class AuthenticationService {

    private getUserDetailsUrl = Constants.DJANGO_SERVER + Constants.api_version + '/school/get-user-details/';
    private loginUserDetailsUrl = Constants.DJANGO_SERVER + Constants.api_version + '/school/login-user-details/';

    private headers = new Headers({'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    loginUserDetails(username: any, password: any): Promise<any> {
        const body = { 'username' : username , 'password' : password };
        this.headers = new Headers({'Content-Type' : 'application/json'});
        return this.http.post(this.loginUserDetailsUrl, body, {headers : this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            })
            .catch(this.handleAuthenticationError );
    }

    getUserDetails(token: string): Promise<any> {
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.get(this.getUserDetailsUrl, {headers : this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            }, error => {
                return 'failed';
            });
    }

    private handleAuthenticationError(error: any): Promise<any> {
        alert('login failed');
        return Promise.reject(error.message || error);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
