import { Injectable } from '@angular/core';

import { CommonServiceRequirements } from '../../common-service-requirements';

@Injectable()
export class SmsOldService extends CommonServiceRequirements {

    // SMS Count
    getSMSCount(data: any, token: any): Promise<any> {
        const url = '/sms/school/' + data['parentSchool'] + '/sms-count';
        return super.getData(token, url);
    }

    // SMS Purchase
    getSMSPurchaseList(data: any, token: any): Promise<any> {
        const url = '/sms/school/' + data['parentSchool'] + '/sms-purchases';
        return super.getData(token, url);
    }
}
