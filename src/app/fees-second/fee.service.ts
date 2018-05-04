import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from '../services/common-service-requirements';

import { URLSearchParams } from '@angular/http';

@Injectable()
export class FeeService extends CommonServiceRequirements {

    //Fee Type
    getFeeTypeList(token: string): Promise<any> {
        return super.getData(token, '/fee-second/fee-types');
    }

    // Fee Structure
    getFeeStructure(data: any, token: string): Promise<any> {
        return super.getData(token,
            '/fee-second/school/' + data['schoolDbId'] + '/fee-structures?session_id=' + data['sessionDbId']);
    }

    // Fee Definition
    createFeeDefinition(data: any, token: string): Promise<any> {
        return super.postData(data, token, '/fee-second/school/' + data['schoolDbId'] + '/fee-definitions');
    }

    updateFeeDefinition(data: any, token: string): Promise<any> {
        return super.putData(data, token, '/fee-second/fee-definitions/' + data['dbId']);
    }

    deleteFeeDefinition(data: any, token: string): Promise<any> {
        return super.deleteData(token, '/fee-second/fee-definitions/' + data['dbId']);
    }

    // Student Fee Status
    getStudentFeeStatus(data: any, token: string): Promise<any> {
        return super.getData(token, '/fee-second/student/' + data['studentDbId'] + '/fee-status');
    }

    updateStudentFeeStatus(data: any, token: string): Promise<any> {
        return super.postData(data['studentFeeStatus'], token, '/fee-second/student/' + data['studentDbId'] + '/fee-status');
    }

    getStudentSessionFeeStatus(data: any, token: string): Promise<any> {
        return super.getData(token, '/fee-second/student/' + data['studentDbId'] + '/fee-status?session_id=' + data['sessionDbId']);
    }

    // Fee Receipt
    createFeeReceipt(data: any, token: string): Promise<any> {
        return super.postData(data, token, '/fee-second/student/' + data['studentDbId'] + '/fee-receipts');
    }

    getStudentFeeReceiptList(data: any, token: string): Promise<any> {
        return super.getData(token, '/fee-second/student/' + data['studentDbId'] + '/fee-receipts');
    }

    getSchoolFeeReceiptList(data: any, token: string): Promise<any> {
        return super.getData(token, '/fee-second/school/'
            + data['schoolDbId']
            + '/fee-receipts?startDate=' + data['startDate']
            + '&endDate=' + data['endDate']);
    }

    // Concession
    createConcession(data: any, token: string): Promise<any> {
        return super.postData(data, token, '/fee-second/student/' + data['studentDbId'] + '/concessions');
    }

    getStudentConcessionList(data: any, token: string): Promise<any> {
        return super.getData(token, '/fee-second/student/' + data['studentDbId'] + '/concessions');
    }

    getSchoolConcessionList(data: any, token: string): Promise<any> {
        return super.getData(token, '/fee-second/school/'
            + data['schoolDbId']
            + '/concessions?startDate=' + data['startDate']
            + '&endDate=' + data['endDate']);
    }

}
