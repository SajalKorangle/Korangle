import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class OnlineClassService extends ServiceObject {
    protected module_url = '/online-class';

    // objects urls
    public online_class = '/online-class';
    public account_info = '/account-info';
    public restricted_students = '/restricted-students';
    public zoom_meeting_signature = '/zoom-meeting-signature';

}
