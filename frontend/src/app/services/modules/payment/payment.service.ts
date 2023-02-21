import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class PaymentService extends ServiceObject {

    public module_url = '/payment';

    public settlement_cycle = '/cashfree/settlement-cycle';
    public ifsc_verification = '/cashfree/ifsc-verification';
    public bank_account_verification = '/cashfree/bank-account-verification';

    public school_merchant_account = '/school-merchant-account';

    // cashfree payment routes
    public order_school = '/order-school';
    public order_self = '/order-self';

    // easebuzz payment routes
    public easebuzz_order_self = '/easebuzz-order-self';
}
