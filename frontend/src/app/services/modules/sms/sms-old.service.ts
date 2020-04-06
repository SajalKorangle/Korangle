import {Injectable} from '@angular/core';


import { CommonServiceRequirements } from '../../common-service-requirements';
import { DataStorage } from '../../../classes/data-storage';

@Injectable()
export class SmsOldService extends CommonServiceRequirements {

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

    // Msg Club Delivery Report
    getMsgClubDeliveryReport(data: any): Promise<any> {
        const url = '/sms/msg-club-delivery-report?requestId='+data['requestId'];
        return super.getData(DataStorage.getInstance().getUser().jwt, url);
    }

}
