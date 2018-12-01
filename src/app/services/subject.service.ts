import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../services/common-service-requirements';

@Injectable()
export class SubjectService extends CommonServiceRequirements {

    // Subject
    getSubjectList(token: any): Promise<any> {
        return super.getData(token, '/subject/subjects');
    }

    // Class Subject
    getClassSubjectList(data: any, token: any): Promise<any> {
        if (data['classId'] && data['sectionId']) {
            return super.getData(token,
                '/subject/class-subjects/batch?sessionId='+data['sessionId']
                +'&classId='+data['classId']
                +'&sectionId='+data['sectionId']
                +'&schoolId='+data['schoolId']);
        } else {
            return super.getData(token,
                '/subject/class-subjects/batch?sessionId='+data['sessionId']+'&schoolId='+data['schoolId']);
        }
    }

    createClassSubject(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/subject/class-subjects');
    }

    deleteClassSubject(data: any, token: any): Promise<any> {
        return super.deleteData(token, '/subject/class-subjects/'+data);
    }

    // Student Subject
    getStudentSubjectList(data: any, token: any): Promise<any> {
        if (data['schoolId']) {
            return super.getData(token,
                '/subject/student-subjects/batch?sessionId='+data['sessionId']+'&schoolId='+data['schoolId']);
        } else if(data['studentId']) {
            return super.getData(token,
                '/subject/student-subjects/batch?sessionId='+data['sessionId']+'&studentId='+data['studentId']);
        }
    }

    createStudentSubjectList(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/subject/student-subjects/batch');
    }

    deleteStudentSubjectList(data: any, token: any): Promise<any> {
        return super.deleteData(token, '/subject/student-subjects/batch/'+data);
    }

    createStudentSubject(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/subject/student-subjects');
    }

    deleteStudentSubject(data: any, token: any): Promise<any> {
        return super.deleteData(token, '/subject/student-subjects/'+data);
    }

}
