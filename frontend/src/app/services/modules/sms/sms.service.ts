import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class SmsService extends ServiceObject {
    protected module_url = '/sms';

    // objects urls
    public sms = '/sms';
    public diff_sms = '/send-diff-sms';
    // public sms_purchase = '/sms-purchase';
    // public msg_club_delivery_report = '/msg-club-delivery-report';
    public online_sms_payment_transaction = '/online-sms-payment-transaction';
}
