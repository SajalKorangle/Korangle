import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { URLSearchParams } from '@angular/http';

import { CommonServiceRequirements } from '../../services/common-service-requirements';

@Injectable()
export class SmsService extends CommonServiceRequirements {

    // SMS
    sendSMS(data: any, token: any): Promise<any> {
        const url = '/sms/send-sms';
        return super.postData(data, token, url);
    }

    getSMSList(data: any, token: any): Promise<any> {
        const url = '/sms/school/' + data['parentSchool'] + '/sms'
            + '?startDateTime=' + data['startDateTime'] + '&endDateTime=' + data['endDateTime'];
        return super.getData(token, url);
    }

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
