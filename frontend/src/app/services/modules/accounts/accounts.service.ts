import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class AttendanceService extends ServiceObject {

    protected module_url = '/accounts';

    // objects urls
    public heads = '/heads';
    public employee_amount_permission = '/employee-amount-permission';
    public accounts = '/accounts';
    public account_session = '/account-session';
    public transaction = '/transaction';
    public approval_requests = '/approval-requests';
    public transaction_account_details = '/transaction-account-details';
    public transaction_images = '/transaction-images';
    public settings = '/settings';

}
