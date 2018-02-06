import {Injectable} from '@angular/core';

import { Headers, Http } from '@angular/http';

import { Constants } from '../classes/constants';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthenticationService {

    /*private getUserDetailsUrl = Constants.DJANGO_SERVER_AUTH + 'get-user-details/';
    private loginUserDetailsUrl = Constants.DJANGO_SERVER_AUTH + 'login-user-details/';*/

    private getUserDetailsUrl = Constants.DJANGO_SERVER + 'get-user-details/';
    private loginUserDetailsUrl = Constants.DJANGO_SERVER + 'login-user-details/';

    private headers = new Headers({'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    /*checkAuthentication(): Promise<string> {
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + this.jwt });
        return this.http.get(this.authenticationUrl, {headers : this.headers})
            .toPromise()
            .then(response => {
                console.log(response.json());
                return response.json().message;
            })
            .catch(this.handleError);
    }*/

    loginUserDetails(username: any, password: any): Promise<any> {
        const body = { 'username' : username , 'password' : password };
        this.headers = new Headers({'Content-Type' : 'application/json'});
        return this.http.post(this.loginUserDetailsUrl, body, {headers : this.headers})
            .toPromise()
            .then(response => {
                // console.log(response.json());
                return response.json().data;
            })
            .catch(this.handleAuthenticationError );
    }

    getUserDetails(token: string): Promise<any> {
        console.log(token);
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.get(this.getUserDetailsUrl, {headers : this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            });
    }

    /*login(username: any, password: any): Promise<any> {
        const body = { 'username' : username , 'password' : password };
        this.headers = new Headers({'Content-Type' : 'application/json'});
        return this.http.post(this.loginUrl, body, {headers : this.headers})
            .toPromise()
            .then(response => {
                console.log(response.json());
                this.jwt = response.json().token;
                this.headers = new Headers({'Content-Type' : 'application/json', 'Authorization' : 'JWT ' + this.jwt });
                return this.http.get(this.getUserDetailsUrl, {headers : this.headers})
                    .toPromise()
                    .then( userDetailsRes => {
                        console.log(userDetailsRes.json());
                        return userDetailsRes.json().data;
                    })
                    .catch(this.handleError);
            })
            .catch(this.handleAuthenticationError );
    }

    logout(): Promise<string> {
        this.jwt = '';
        return this.http.get(this.logoutUrl, {headers : this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            });
    }*/

    /*getStudentData(dbId: any): Promise<Student> {
        const body = JSON.stringify({'dbId': dbId});
        return this.http.post(this.studentDataUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data as Student;
            })
            .catch(this.handleError);
    }

    updateStudentData(student: Student): Promise<Student> {
        const body = JSON.stringify(student);
        return this.http.post(this.updateStudentUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data as Student;
            });
    }*/

    private handleAuthenticationError(error: any): Promise<any> {
        alert('login failed');
        return Promise.reject(error.message || error);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
