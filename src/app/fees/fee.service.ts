import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from '../services/common-service-requirements';

@Injectable()
export class FeeService extends CommonServiceRequirements {

    // Variables

    /* Common */
    private getStudentFeeDataUrl = '/fee/get_student_fee_data/';

    /* Submit Fee */
    private newFeeReceiptUrl = '/fee/new_fee_receipt/';

    /* Fees List */
    private feesListUrl = '/fee/fees_list/';

    /* Give Concession */
    private giveConcessionUrl = '/fee/new_concession/';

    /* Concession List */
    private concessionListUrl = '/fee/concession_list/';

    // Functions

    /* Common */
    getStudentFeeData(data: any, token: any): Promise<any> {
        return super.postData(data, token, this.getStudentFeeDataUrl);
    }

    /* Submit Fee */
    submitFee(data: any, token: any): Promise<any> {
        return super.postData(data, token, this.newFeeReceiptUrl);
    }

    /* Fees List */
    getFeesList(data: any, token: any): Promise<any> {
        return super.postData(data, token, this.feesListUrl);
    }

    /* Give Concession */
    giveConcesssion(data: any, token: any): Promise<any> {
        return super.postData(data, token, this.giveConcessionUrl);
    }

    /* Concession List */
    getConcessionList(data: any, token: any): Promise<any> {
        return super.postData(data, token, this.concessionListUrl);
    }

}
