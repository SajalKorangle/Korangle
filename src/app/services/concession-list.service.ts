import {Injectable} from '@angular/core';

import { Concession } from '../classes/concession';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from '../classes/constants';

@Injectable()
export class ConcessionListService {

    private concessionListUrl = Constants.DJANGO_SERVER + '/school/concession_list/';

    private headers = new Headers({'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    getConcessionList(startDate: any, endDate: any): Promise<Concession[]> {
        const body = JSON.stringify({'startDate': startDate, 'endDate': endDate});
        const token = localStorage.getItem('schoolJWT');
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.concessionListUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data as Concession[];
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
