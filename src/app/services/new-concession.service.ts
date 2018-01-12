import {Injectable} from '@angular/core';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from '../classes/constants';

@Injectable()
export class NewConcessionService {

    private newConcessionUrl = Constants.DJANGO_SERVER + 'new_concession/';

    private headers = new Headers({'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    submitStudentConcession(concession: any): Promise<any> {
        const body = JSON.stringify(concession);
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + localStorage.getItem('schoolJWT') });
        return this.http.post(this.newConcessionUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
