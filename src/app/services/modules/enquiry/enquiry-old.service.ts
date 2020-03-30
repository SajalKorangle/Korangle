import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../../common-service-requirements';

@Injectable()
export class EnquiryOldService extends CommonServiceRequirements {

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

    deleteEnquiry(data: any, token: any): Promise<any> {
        const url = '/enquiry/enquiries/' + data['id'];
        return super.deleteData(token, url);
    }

    // Mini Enquiry
    getMiniEnquiryList(data: any, token: any): Promise<any> {
        const url = '/enquiry/school/' + data['parentSchool'] + '/mini-enquiries';
        return super.getData(token, url);
    }

}
