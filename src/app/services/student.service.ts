import {Injectable} from '@angular/core';

import { Student } from '../classes/student';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from "../classes/constants";

@Injectable()
export class StudentService {

    private studentDataUrl = Constants.DJANGO_SERVER + 'student_data/';
    private updateStudentUrl = Constants.DJANGO_SERVER + 'update_student/';
    private deleteStudentUrl = Constants.DJANGO_SERVER + 'delete_student_view/';

    private headers = new Headers({'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    getStudentData(dbId: any): Promise<any> {
        const body = JSON.stringify({'dbId': dbId});
        const token = localStorage.getItem('schoolJWT');
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
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
            }).catch(this.handleError);
    }

    deleteStudentProfile(studentDbId: any): Promise<any> {
        const body = { 'studentDbId': studentDbId };
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + localStorage.getItem('schoolJWT') });
        return this.http.post(this.deleteStudentUrl, body, {headers: this.headers})
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
