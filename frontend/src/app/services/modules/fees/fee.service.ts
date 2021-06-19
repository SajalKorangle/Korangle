import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class FeeService extends ServiceObject {
    public module_url = '/fees';

    // objects urls
    public fee_type = '/fee-types';
    public school_fee_rules = '/school-fee-rules';
    public class_filter_fees = '/class-filter-fees';
    public bus_stop_filter_fees = '/bus-stop-filter-fees';
    public student_fees = '/student-fees';
    public fee_receipts = '/fee-receipts';
    public sub_fee_receipts = '/sub-fee-receipts';
    public discounts = '/discounts';
    public sub_discounts = '/sub-discounts';
    public fee_features = '/fee-features';
    public fee_settings = '/fee-settings';

    //Cashfree
    public settelment_cycle = '/cashfree/settelment-cycle';
    public ifsc_verification = '/cashfree/ifsc-verification';
    public bank_account_verification = '/cashfree/bank-account-verification';

    public online_payment_account = '/cashfree/online-payment-account';
    public transaction = '/cashfree/transaction';
    public order = '/cashfree/order';
    public order_completion = '/cashfree/order-completion';
}
