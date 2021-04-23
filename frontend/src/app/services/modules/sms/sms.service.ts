import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class SmsService extends ServiceObject {
    protected module_url = '/sms';

    // objects urls
    public sms = '/sms';
    public diff_sms = '/send-diff-sms';
    public sms_id='/sms-id';
    public sms_template='/sms-template';
    public sms_id_school='/sms-id-school';
    public sms_event='/sms-event';
    public sms_event_setting='/sms-event-setting'
    // public sms_purchase = '/sms-purchase';
    // public msg_club_delivery_report = '/msg-club-delivery-report';
}
