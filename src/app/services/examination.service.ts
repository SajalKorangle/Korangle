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
        if (data['schoolId'] && data['sessionId']) {
            return super.getData(token, '/examinations/tests/batch?sessionId='+data['sessionId']
                +'&schoolId='+data['schoolId']);
        } else if (data['examinationId'] && data['classId'] && data['sectionId']){
            return super.getData(token, '/examinations/tests/batch?examinationId='+data['examinationId']
                +'&classId='+data['classId']
                +'&sectionId='+data['sectionId']);
        }
    }

    createTest(data: any, token: any): Promise<any> {
        return super.postData(data, token, '/examinations/tests');
    }

    deleteTest(testId: any, token: any): Promise<any> {
        return super.deleteData(token, '/examinations/tests/'+testId);
    }

}
