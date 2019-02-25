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
        let url = '/subject/class-subjects/batch?e=';
        Object.keys(data).forEach(key => {
            url += '&'+key+'='+data[key];
        });
        return super.getData(token, url);
        /*if ('subjectList' in data) {
            let url = '/subject/class-subjects/batch' +
                '?subjectList=' + data['subjectList'].join() +
                '&schoolList=' + data['schoolList'].join() +
                '&employeeList=' + data['employeeList'].join() +
                '&classList=' + data['classList'].join() +
                '&sectionList=' + data['sectionList'].join() +
                '&sessionList=' + data['sessionList'].join() +
                '&mainSubject=' + data['mainSubject'].join() +
                '&onlyGrade=' + data['onlyGrade'].join();
            return super.getData(token, url);
        } else {
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
        }*/
    }

    createClassSubject(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/subject/class-subjects');
    }

    updateClassSubject(data: any, token: any): Promise<any> {
        return super.putData(data, token, '/subject/class-subjects/'+data['id']);
    }

    deleteClassSubject(data: any, token: any): Promise<any> {
        return super.deleteData(token, '/subject/class-subjects/'+data);
    }

    // Student Subject
    getStudentSubjectList(data: any, token: any): Promise<any> {
        if (data['studentList']) {
            let url = '/subject/student-subjects/batch' +
                '?studentList=' + data['studentList'].join() +
                '&subjectList=' + data['subjectList'].join() +
                '&sessionList=' + data['sessionList'].join();
            return super.getData(token, url);
        } else if (data['schoolId']) {
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

    // Extra Field
    getExtraFieldList(data: any, token: any): Promise<any> {
        let url = '/subject/extra-fields/batch?e=';
        Object.keys(data).forEach(key => {
            url += '&'+key+'='+data[key];
        });
        return super.getData(token, url);
    }

    // Extra Sub Field
    getExtraSubFieldList(data: any, token: any): Promise<any> {
        let url = '/subject/extra-sub-fields/batch?e=';
        Object.keys(data).forEach(key => {
            url += '&'+key+'='+data[key];
        });
        return super.getData(token, url);
    }

}
