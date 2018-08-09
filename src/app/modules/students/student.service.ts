import {Injectable} from '@angular/core';

import { Student } from '../../classes/student';

// import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
// import {Constants} from '../classes/constants';

import { CommonServiceRequirements } from '../../services/common-service-requirements';

@Injectable()
export class StudentService extends CommonServiceRequirements {

    // Profile Image
    uploadProfileImage(file: any, data: any, token: any): Promise<any> {
        const url = '/student/' + data['id'] + '/profile-image';
        return super.fileData(file, token, url);
    }

    // Student Full Profile
    getStudentFullProfileList(data: any, token: any): Promise<any> {
        const url = '/student/school/' + data['schoolDbId'] + '/student-full-profiles?session_id=' + data.sessionDbId;
        return super.getData(token, url);
    }

    createStudentFullProfileBatch(data: any, token: any): Promise<any> {
        const url = '/student/student-full-profiles/batch';
        return super.postData(data, token, url);
    }

    partiallyUpdateStudentFullProfile(data: any, token: any): Promise<any> {
        const url = '/student/student-full-profiles/' + data['id'];
        return super.patchData(data, token, url);
    }

    // Student Mini Profile
    getStudentMiniProfileList(data, token): Promise<any> {
        return super.getData(token, '/student/school/'
            + data['schoolDbId'] + '/student-mini-profiles?session_id='
            + data['sessionDbId']);
    }

    // Student Section
    updateStudentSection(data, token): Promise<any> {
        return super.putData(data, token, '/student/student-sections/' + data['id']);
    }

    createStudentSectionList(data, token): Promise<any> {
        return super.postData(data, token, '/student/student-sections/batch');
    }

    // Transfer Certificate
    getTransferCertificate(data, token): Promise<any> {
        return super.getData(token, '/student/transfer-certificates/' + data['id']);
    }

    createTransferCertificate(data, token): Promise<any> {
        return super.postData(data, token, '/student/transfer-certificates');
    }

    updateTransferCertificate(data, token): Promise<any> {
        return super.putData(data, token, '/student/transfer-certificates/' + data['id']);
    }


    // Variables

    /* Update Profile */
    // private classSectionStudentListUrl = '/student/class_section_student_list/';
    private getStudentProfileUrl = '/student/get_student_profile/';
    private updateStudentProfileUrl = '/student/update_student_profile/';
    private deleteStudentUrl = '/student/delete_student/';

    /* View All */
    // private getStudentProfileListAndClassSectionListUrl = '/student/get_student_profile_list_and_class_section_list/';

    /* New Student */
    private createNewStudentUrl = '/student/create_new_student/';

    /* Promote Student */

    // Functions

    /* Update Profile */
    getClassSectionStudentList(data: any, token: any): Promise<any> {
        const url = '/student/class_section_student_list/school/' + data.schoolDbId + '/sessions/' + data.sessionDbId;
        return super.getData(token, url);
    }

    getStudentProfile(data: any, token: any): Promise<any> {
        return super.postData(data, token, this.getStudentProfileUrl);
    }

    updateStudentProfileOld(student: Student, token: any): Promise<any> {
        return super.postData(JSON.stringify(student), token, this.updateStudentProfileUrl);
    }

    deleteStudentProfile(studentDbId: any, token: any): Promise<any> {
        return super.postData({'studentDbId': studentDbId}, token, this.deleteStudentUrl);
    }

    /* View All */
    getStudentProfileListAndClassSectionList(data: any, token: any): Promise<any> {
        const url = '/student/get_student_profile_list_and_class_section_list/sessions/' + data.sessionDbId;
        return super.getData(token, url);
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
