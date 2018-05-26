import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from '../../services/common-service-requirements';

@Injectable()
export class EnquiryService extends CommonServiceRequirements {

    // Enquiry
    createEnquiry(data: any, token: any): Promise<any> {
        const url = '/enquiry/enquiries';
        return super.postData(data, token, url);
    }

    getEnquiry(data: any, token: any): Promise<any> {
        const url = '/enquiry/enquiries/' + data['id'];
        return super.getData(token, url);
    }

    getEnquiryList(data: any, token: any): Promise<any> {
        const url = '/enquiry/school/' + data['parentSchool']
            + '/enquiries?startDate=' + data['startDate'] + '&endDate=' + data['endDate'];
        return super.getData(token, url);
    }

    updateEnquiry(data: any, token: any): Promise<any> {
        const url = '/enquiry/enquiries/' + data['id'];
        return super.putData(data, token, url);
    }

    // Mini Enquiry
    getMiniEnquiryList(data: any, token: any): Promise<any> {
        const url = '/enquiry/school/' + data['parentSchool'] + '/mini-enquiries';
        return super.getData(token, url);
    }

}
