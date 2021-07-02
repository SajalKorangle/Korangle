import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class PaymentService extends ServiceObject {
    public module_url = '/payment';


    //Cashfree
    public settelment_cycle = '/cashfree/settelment-cycle';
    public ifsc_verification = '/cashfree/ifsc-verification';
    public bank_account_verification = '/cashfree/bank-account-verification';

    public online_payment_account = '/online-payment-account';
    public order_school = '/order-school';
    public order_self = '/order-self';
    public order_completion = '/order-completion';
}
