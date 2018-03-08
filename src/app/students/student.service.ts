import {Injectable} from '@angular/core';

import { Student } from '../classes/student';

// import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
// import {Constants} from '../classes/constants';

import { CommonServiceRequirements } from '../services/common-service-requirements';

@Injectable()
export class StudentService extends CommonServiceRequirements {

    // Variables

    /* Update Profile */
    private classSectionStudentListUrl = '/student/class_section_student_list/';
    private getStudentProfileUrl = '/student/get_student_profile/';
    private updateStudentProfileUrl = '/student/update_student_profile/';
    private deleteStudentUrl = '/student/delete_student/';

    /* View All */
    private getStudentProfileListAndClassSectionListUrl = '/student/get_student_profile_list_and_class_section_list/';

    /* New Student */
    private createNewStudentUrl = '/student/create_new_student/';

    /* Promote Student */

    // Functions

    /* Update Profile */
    getClassSectionStudentList(token: any): Promise<any> {
        return super.getData(token, this.classSectionStudentListUrl);
    }

    getStudentProfile(dbId: any, token: any): Promise<any> {
        return super.postData({'studentDbId': dbId}, token, this.getStudentProfileUrl);
    }

    updateStudentProfile(student: Student, token: any): Promise<any> {
        return super.postData(JSON.stringify(student), token, this.updateStudentProfileUrl);
    }

    deleteStudentProfile(studentDbId: any, token: any): Promise<any> {
        return super.postData({'studentDbId': studentDbId}, token, this.deleteStudentUrl);
    }

    /* View All */
    getStudentProfileListAndClassSectionList(token: any): Promise<any> {
        return super.getData(token, this.getStudentProfileListAndClassSectionListUrl);
    }

    /* New Student */
    createNewStudent(student: any, token: any): Promise<any> {
        return super.postData(JSON.stringify(student), token, this.createNewStudentUrl);
    }

    /* Promote Student */

    getStudentListSessionClassWise(sessionDbId: number, classDbId: number, token: string): Promise<any> {
        return super.postData({'sessionDbId': sessionDbId, 'classDbId': classDbId}, token, '');
    }

    promoteStudentList(studentList: any,
                       fromSessionDbId: number, fromClassDbId: number,
                       toSessionDbId: number, toClassDbId: number,
                       token: string) {
        return super.postData({
                                        'studentList': studentList,
                                        'fromSessionDbId': fromSessionDbId,
                                        'fromClassDbId': fromClassDbId,
                                        'toSessionDbId': toSessionDbId,
                                        'toClassDbId': toClassDbId
                                    }, token, '');
    }

}
