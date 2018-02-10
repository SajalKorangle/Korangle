import {Injectable} from '@angular/core';

import { Student } from '../classes/student';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from "../classes/constants";

@Injectable()
export class NewStudentService {

    private newStudentUrl = Constants.DJANGO_SERVER + 'new_student/';

    private headers = new Headers({'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    createNewStudent(student: any, token: any): Promise<string> {
        const body = JSON.stringify(student);
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.newStudentUrl, body, {headers: this.headers})
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
