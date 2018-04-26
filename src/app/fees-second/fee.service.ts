import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from '../services/common-service-requirements';

import { URLSearchParams } from '@angular/http';

@Injectable()
export class FeeService extends CommonServiceRequirements {

    getStudentFeeStatus(data: any, token: string): Promise<any> {
        return super.getData(token, '/fee-second/student/' + data['studentDbId'] + '/fee-status');
    }

    createFeeReceipt(data: any, token: string): Promise<any> {
        return super.postData(data, token, '/fee-second/student/' + data['studentDbId'] + '/fee-receipts');
    }

    getStudentFeeReceipts(data: any, token: string): Promise<any> {
        return super.getData(token, '/fee-second/student/' + data['studentDbId'] + '/fee-receipts');
    }

    getSchoolFeeReceipts(data: any, token: string): Promise<any> {
        return super.getData(token, '/fee-second/school/'
            + data['schoolDbId']
            + '/fee-receipts?startDate=' + data['startDate']
            + '&endDate=' + data['endDate']);
    }

}
