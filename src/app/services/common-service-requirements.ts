import {Injectable} from '@angular/core';

import { Constants } from '../classes/constants';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CommonServiceRequirements {

    constructor(private http: Http) { }

    public returnResponse(response: any): any {
        const jsonResponse = response.json().response;
        if (jsonResponse.status === 'success') {
            if (jsonResponse.data) return jsonResponse.data;
            else return jsonResponse.message;
        } else if (jsonResponse.status === 'fail') {
            alert(jsonResponse.message);
            // return null;
            throw new Error();
        } else {
            alert('Unexpected response from server');
            return null;
        }
    }

    public postData(body: any, token: any, url: any): Promise<any> {
        const headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(Constants.DJANGO_SERVER + url, body, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response);
            }, error => {
                alert('Server Error: Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    public getData(token: any, url: any): Promise<any> {
        const headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.get(Constants.DJANGO_SERVER + url, {headers: headers})
            .toPromise()
            .then(response => {
                return this.returnResponse(response);
            }, error => {
                alert('Server Error: Contact Admin');
                return null;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
