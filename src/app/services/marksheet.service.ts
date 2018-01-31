import {Injectable} from '@angular/core';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from '../classes/constants';

@Injectable()
export class MarksheetService {

    private getStudentMarksheetUrl = Constants.DJANGO_SERVER + 'get_student_marksheet/';
    private updateStudentMarksheetUrl = Constants.DJANGO_SERVER + 'update_student_marksheet/';
    private deleteStudentMarksheetUrl = Constants.DJANGO_SERVER + 'delete_student_marksheet/';

    private headers = new Headers({'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    getStudentMarksheet(studentDbId: any, token: string): Promise<any> {
        const body = JSON.stringify({'studentDbId': studentDbId});
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.getStudentMarksheetUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            })
            .catch(this.handleError);
    }

    updateStudentMarksheet(marksheet: any, token: any): Promise<any> {
        const body = JSON.stringify({'marksheet': marksheet});
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.updateStudentMarksheetUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            }).catch(this.handleError);
    }

    deleteStudentMarksheet(studentDbId: any, token: any): Promise<any> {
        const body = { 'studentDbId': studentDbId };
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.deleteStudentMarksheetUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            }).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
