import {Injectable} from '@angular/core';

import { Session } from '../classes/session';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from '../classes/constants';

@Injectable()
export class SessionClassListService {

    private sessionClassListUrl = Constants.DJANGO_SERVER + '/school/session_class_list/';

    constructor(private http: Http) { }

    getSessionClassList(token: string): Promise<any[]> {
        const headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.get(this.sessionClassListUrl, {headers: headers})
            .toPromise()
            .then(response => {
                return response.json().data as any[];
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
