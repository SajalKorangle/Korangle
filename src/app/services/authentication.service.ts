import {Injectable} from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Constants } from '../classes/constants';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthenticationService {

    private getUserDetailsUrl = environment.DJANGO_SERVER + Constants.api_version + '/school/get-user-details/';
    private loginUserDetailsUrl = environment.DJANGO_SERVER + Constants.api_version + '/school/login-user-details/';

    private headers = new HttpHeaders({'Content-Type': 'application/json' });

    constructor(private http: HttpClient) { }

    loginUserDetails(username: any, password: any): Promise<any> {
        const body = { 'username' : username , 'password' : password };
        this.headers = new HttpHeaders({'Content-Type' : 'application/json'});
        return this.http.post(this.loginUserDetailsUrl, body, {headers : this.headers})
            .toPromise()
            .then(response => {
                // return response.json().data;
                return (<any>response).data;
            })
            .catch(this.handleAuthenticationError );
    }

    getUserDetails(token: string): Promise<any> {
        this.headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.get(this.getUserDetailsUrl, {headers : this.headers})
            .toPromise()
            .then(response => {
                return (<any>response).data;
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
