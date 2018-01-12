import {Injectable} from '@angular/core';

import { Classs } from '../classes/classs';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from "../classes/constants";

@Injectable()
export class ClassStudentListService {

    // private djangoServer = 'http://localhost:8000/';
    private djangoServer = 'http://54.174.109.85:8000/';

    private classStudentListUrl = Constants.DJANGO_SERVER + 'class_student_list/';

    constructor(private http: Http) { }

    getIndex(): Promise<Classs[]> {
        const token = localStorage.getItem('schoolJWT');
        const headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.get(this.classStudentListUrl, {headers: headers})
            .toPromise()
            .then(response => {
                return response.json().data as Classs[];
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
