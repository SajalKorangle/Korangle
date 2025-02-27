import { Injectable } from '@angular/core';

import { CommonServiceRequirements } from '../../common-service-requirements';

@Injectable()
export class ExaminationOldService extends CommonServiceRequirements {
    // Examination
    getExaminationList(data: any, token: any): Promise<any> {
        if ('sessionId' in data) {
            return super.getData(
                token,
                '/examinations/examinations/batch?sessionId=' + data['sessionId'] + '&schoolId=' + data['schoolId']
            );
        } else {
            let url = '/examinations/examinations/batch?e=';
            Object.keys(data).forEach((key) => {
                url += '&' + key + '=' + data[key];
            });
            return super.getData(token, url);
        }
    }

    createExamination(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/examinations/examinations');
    }

    updateExamination(data: any, token: any): Promise<any> {
        return super.putData(data, token, '/examinations/examinations');
    }

    // Test
    getTestList(data: any, token: any): Promise<any> {
        let url = '/examinations/tests/batch?e=';
        Object.keys(data).forEach((key) => {
            url += '&' + key + '=' + data[key];
        });
        return super.getData(token, url);
    }

    createTest(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/examinations/tests');
    }

    updateTest(data: any, token: any): Promise<any> {
        return super.putData(data, token, '/examinations/tests');
    }

    deleteTest(testId: any, token: any): Promise<any> {
        return super.deleteData(token, '/examinations/tests/' + testId);
    }

    // Student Test
    getStudentTestList(data: any, token: any): Promise<any> {
        let url =
            '/examinations/student-tests/batch' +
            '?studentList=' +
            data['studentList'].join() +
            '&examinationList=' +
            data['examinationList'].join() +
            '&subjectList=' +
            data['subjectList'].join() +
            '&testTypeList=' +
            data['testTypeList'].join() +
            '&marksObtainedList=' +
            data['marksObtainedList'].join();
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

    // CCE Marks
    getCCEMarksList(data: any, token: any): Promise<any> {
        let url = '/examinations/old-cce-marks/batch?e=';
        Object.keys(data).forEach((key) => {
            url += '&' + key + '=' + data[key];
        });
        return super.getData(token, url);
    }

    createCCEMarksList(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/examinations/old-cce-marks/batch');
    }

    updateCCEMarksList(data: any, token: any): Promise<any> {
        return super.putData(data, token, '/examinations/old-cce-marks/batch');
    }

    // Student Extra Sub Field
    getStudentExtraSubFieldList(data: any, token: any): Promise<any> {
        let url = '/examinations/old-student-extra-sub-fields/batch?e=';
        Object.keys(data).forEach((key) => {
            url += '&' + key + '=' + data[key];
        });
        return super.getData(token, url);
    }

    createStudentExtraSubFieldList(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/examinations/old-student-extra-sub-fields/batch');
    }

    updateStudentExtraSubFieldList(data: any, token: any): Promise<any> {
        return super.putData(data, token, '/examinations/old-student-extra-sub-fields/batch');
    }

    // Mp Board Report Card Mapping
    getMpBoardReportCardMapping(data: any, token: any): Promise<any> {
        let url = '/examinations/mp-board-report-card-mappings?e=';
        Object.keys(data).forEach((key) => {
            url += '&' + key + '=' + data[key];
        });
        return super.getData(token, url);
    }

    createMpBoardReportCardMapping(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/examinations/mp-board-report-card-mappings');
    }

    updateMpBoardReportCardMapping(data: any, token: any): Promise<any> {
        return super.putData(data, token, '/examinations/mp-board-report-card-mappings');
    }
}
