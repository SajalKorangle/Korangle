import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class AccountsService extends ServiceObject {
    protected module_url = '/accounts';

    // objects urls
    public heads = '/heads';
    public employee_amount_permission = '/employee-amount-permission';
    public accounts = '/accounts';
    public account_session = '/account-session';
    public transaction = '/transaction';
    public approval = '/approval';
    public transaction_account_details = '/transaction-account-details';
    public transaction_images = '/transaction-images';
    public settings = '/settings';
    public approval_account_details = '/approval-account-details';
    public approval_images = '/approval-images';
    public lock_accounts = '/lock-accounts';
}
