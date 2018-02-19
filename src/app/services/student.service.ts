import {Injectable} from '@angular/core';

import { Student } from '../classes/student';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Constants} from '../classes/constants';

@Injectable()
export class StudentService {

    /* school app */
    private studentDataUrl = Constants.DJANGO_SERVER + '/school/student_data/';
    private updateStudentUrl = Constants.DJANGO_SERVER + '/school/update_student/';
    private deleteStudentUrl = Constants.DJANGO_SERVER + '/school/delete_student_view/';
    private studentDataClassListUrl = Constants.DJANGO_SERVER + '/school/student_data_class_list/';

    /* student app */
    private studentListSessionClassWiseUrl = Constants.DJANGO_SERVER + '/student/student_list_session_class_wise/';
    private promoteStudentListUrl = Constants.DJANGO_SERVER + '/student/promote_student_list/';

    /* headers */
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
        const token = localStorage.getItem('schoolJWT');
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
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

    getStudentDataClassList(): Promise<any> {
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + localStorage.getItem('schoolJWT') });
        return this.http.get(this.studentDataClassListUrl, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            }).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getStudentListSessionClassWise(sessionDbId: number, classDbId: number, token: string): Promise<any> {
        const body = { 'sessionDbId': sessionDbId, 'classDbId': classDbId };
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.studentListSessionClassWiseUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            }).catch(this.handleError);
    }

    promoteStudentList(studentList: any,
                       fromSessionDbId: number, fromClassDbId: number,
                       toSessionDbId: number, toClassDbId: number,
                       token: string) {
        const body = { 'studentList': studentList,
            'fromSessionDbId': fromSessionDbId, 'fromClassDbId': fromClassDbId,
            'toSessionDbId': toSessionDbId, 'toClassDbId': toClassDbId};
        this.headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'JWT ' + token });
        return this.http.post(this.promoteStudentListUrl, body, {headers: this.headers})
            .toPromise()
            .then(response => {
                return response.json().data;
            }).catch(this.handleError);
    }

}
