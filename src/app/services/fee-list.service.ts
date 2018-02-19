import {Injectable} from '@angular/core';

import { Fee } from '../classes/fee';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from "../classes/constants";

@Injectable()
export class FeeListService {

    private feeListUrl = Constants.DJANGO_SERVER + '/school/fee_list/';

    private headers = new Headers({'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    getFeeList(startDate: any, endDate: any): Promise<Fee[]> {
        const body = JSON.stringify({'startDate': startDate, 'endDate': endDate});
        const token = localStorage.getItem('schoolJWT');
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.feeListUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data as Fee[];
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
