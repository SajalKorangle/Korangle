import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../services/common-service-requirements';

@Injectable()
export class ExaminationService extends CommonServiceRequirements {

    // Examination
    getExaminationList(data: any, token: any): Promise<any> {
        return super.getData(token, '/examinations/examinations/batch?sessionId='+data['sessionId']
            +'&schoolId='+data['schoolId']);
    }

    createExamination(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/examinations/examinations');
    }

    updateExamination(data: any, token: any): Promise<any> {
        return super.putData(data, token, '/examinations/examinations');
    }

    // Test
    getTestList(data: any, token: any): Promise<any> {
        if ('examinationList' in data) {
            let url = '/examinations/tests/batch' +
                '?examinationList=' + data['examinationList'].join() +
                '&subjectList=' + data['subjectList'].join() +
                '&classList=' + data['classList'].join() +
                '&sectionList=' + data['sectionList'].join() +
                '&startTimeList=' + data['startTimeList'].join() +
                '&endTimeList=' + data['endTimeList'].join() +
                '&testTypeList=' + data['testTypeList'].join() +
                '&maximumMarksList=' + data['maximumMarksList'].join();
            return super.getData(token, url);
        } else {
            if (data['schoolId'] && data['sessionId']) {
                return super.getData(token, '/examinations/tests/batch?sessionId='+data['sessionId']
                    +'&schoolId='+data['schoolId']);
            } else if (data['examinationId'] && data['classId'] && data['sectionId']){
                return super.getData(token, '/examinations/tests/batch?examinationId='+data['examinationId']
                    +'&classId='+data['classId']
                    +'&sectionId='+data['sectionId']);
            }
        }
    }

    createTest(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/examinations/tests');
    }

    updateTest(data: any, token: any): Promise<any> {
        return super.putData(data, token, '/examinations/tests');
    }

    deleteTest(testId: any, token: any): Promise<any> {
        return super.deleteData(token, '/examinations/tests/'+testId);
    }

    // Student Test
    getStudentTestList(data: any, token: any): Promise<any> {
        let url = '/examinations/student-tests/batch' +
            '?studentList=' + data['studentList'].join() +
            '&examinationList=' + data['examinationList'].join() +
            '&subjectList=' + data['subjectList'].join() +
            '&testTypeList=' + data['testTypeList'].join() +
            '&marksObtainedList=' + data['marksObtainedList'].join();
        return super.getData(token, url);
    }

    createStudentTestList(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/examinations/student-tests/batch');
    }

    updateStudentTestList(data: any, token: any): Promise<any> {
        return super.putData(data, token, '/examinations/student-tests/batch');
    }

    deleteStudentTestList(data: any, token: any): Promise<any> {
        return super.deleteData(token, '/examinations/student-tests/batch/' + data);
    }

}
