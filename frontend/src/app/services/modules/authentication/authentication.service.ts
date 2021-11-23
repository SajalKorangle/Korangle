import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Constants } from '@classes/constants';

@Injectable()
export class AuthenticationService extends ServiceObject {
    // objects urls
    // public otp = '/otp'; not published by backend

    public module_url = '/authentication';

    constructor(private http_class: HttpClient) {
        super(http_class);
    }

    // Generate OTP is common for all... to distinguish the action add a element {action:'..'} in your body
    public generateOTP(body: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http_class
            .post(environment.DJANGO_SERVER + Constants.api_version + this.module_url + '/generate-otp', body, {headers: headers})
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response);
                },
                (error) => {
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public verifyOTPForSignup(body: any): Promise<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http_class
            .post(environment.DJANGO_SERVER + Constants.api_version + this.module_url + '/verify-otp-for-signup', body, {
                headers: headers,
            })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response);
                },
                (error) => {
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public verifyOTPForPassword(body: any): Promise<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http_class
            .post(environment.DJANGO_SERVER + Constants.api_version + this.module_url + '/verify-otp-for-password', body, { headers: headers })
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response);
                },
                (error) => {
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }

    public verifyOTPForCreateSchool(body: any): Promise<any> {
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http_class
            .post(environment.DJANGO_SERVER + Constants.api_version + this.module_url + '/verify-otp-for-create-school', body, {headers: headers})
            .toPromise()
            .then(
                (response) => {
                    return this.returnResponse(response);
                },
                (error) => {
                    alert('Error: Press Ctrl + F5 to update your software or Contact Admin');
                    return null;
                }
            )
            .catch(this.handleError);
    }
}
