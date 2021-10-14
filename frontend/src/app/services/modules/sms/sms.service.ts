import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class SmsService extends ServiceObject {
    protected module_url = '/sms';

    // objects urls
    public sms = '/send-sms';
    public sms_id = '/sms-id';
    public sms_template = '/sms-template';
    public sms_id_school = '/sms-id-school';
    public sms_event_settings = '/sms-event-settings';
    public sms_event = '/sms-event';
    public sms_default_template = '/sms-default-template';
    public sms_delivery_report = '/sms-delivery-report';
    // public sms_purchase = '/sms-purchase';
    // public msg_club_delivery_report = '/msg-club-delivery-report';
    public sms_purchase = '/sms-purchase';
    public sms_purchase_order = '/sms-purchase-order';
}
