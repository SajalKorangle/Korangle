import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Constants } from '../classes/constants';
import { environment } from '../../environments/environment';

import { checkTokenRevokedStatus } from '@services/revokedTokenHandling';

@Injectable()
export class AuthenticationOldService {
    private getUserDetailsUrl = environment.DJANGO_SERVER + Constants.api_version + '/school/get-user-details/';
    private loginUserDetailsUrl = environment.DJANGO_SERVER + Constants.api_version + '/school/login-user-details/';

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient) {}

    loginUserDetails(username: any, password: any): Promise<any> {

        /* Starts: Getting device name */
        const agent = window.navigator.userAgent.toLowerCase();
        var device_name = '';
        var suffix = '';

        if ( navigator.userAgent === 'Mobile' ) {
            suffix = 'app';
        }
        else {
            suffix = 'web';
        }

        if (agent.match('android')) {
            device_name = 'android-';
        }
        else if (agent.match('windows')) {
            device_name = 'windows-';
        }
        else if (agent.match('mac')) {
            device_name = 'mac-';
        }
        else {
            device_name = 'other-';
        }
        device_name = device_name + suffix;
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
                    //  Handling revoked tokens here
                    if ( checkTokenRevokedStatus(response)) {
                        return null;
                    }
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

}
