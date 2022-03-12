import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Constants } from '../classes/constants';
import { environment } from '../../environments/environment';

import { DataStorage } from '../classes/data-storage';

@Injectable()
export class AuthenticationOldService {
    private getUserDetailsUrl = environment.DJANGO_SERVER + Constants.api_version + '/school/get-user-details/';
    private loginUserDetailsUrl = environment.DJANGO_SERVER + Constants.api_version + '/school/login-user-details/';

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    private user;

    constructor(private http: HttpClient) {}

    loginUserDetails(username: any, password: any): Promise<any> {
        /* Starts: Getting device name */
        const agent = window.navigator.userAgent.toLowerCase();
        var device_name = '';
        if (agent.match('android')) {
            device_name = 'android-web';
        }
        else if (agent.match('windows')) {
            device_name = 'windows-web';
        }
        else if (agent.match('mac')) {
            device_name = 'mac-web';
        }
        else {
            device_name = 'other-web';
        }
        /* Ends: Getting device name */
        const body = { username: username, password: password, device_name: device_name };
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http
            .post(this.loginUserDetailsUrl, body, { headers: this.headers })
            .toPromise()
            .then((response) => {
                // return response.json().data;
                return (<any>response).data;
            })
            .catch(this.handleAuthenticationError);
    }

    getUserDetails(token: string): Promise<any> {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'JWT ' + token });
        return this.http
            .get(this.getUserDetailsUrl, { headers: this.headers })
            .toPromise()
            .then(
                (response) => {
                    /* Starts: Checking if failure is due to revoked token ( access denied), if true then logging out user  */
                    this.user = DataStorage.getInstance().getUser();
                    if (response['token_revoked']) {
                        localStorage.removeItem('schoolJWT');
                        this.user.jwt = '';
                        this.user.isAuthenticated = false;
                        this.user.emptyUserDetails();
                        alert(response['fail']);
                        return null;
                    }
                    /* Ends: Checking if failure is due to revoked token ( access denied)  */
                    return (<any>response).data;
                },
                (error) => {
                    return 'failed';
                }
            );
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
