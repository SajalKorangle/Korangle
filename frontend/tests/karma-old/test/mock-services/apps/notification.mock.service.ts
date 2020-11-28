import {Injectable} from '@angular/core';

import { MockServiceObject } from '@mock-services/common/mock-service-object';
import { NOTIFICATION_APP } from '@urls/notification.url';


@Injectable()
export class NotificationMockService extends MockServiceObject {

    public app_url = NOTIFICATION_APP.url;

    // object urls
    public notification = NOTIFICATION_APP.model_url.notification;
    public gcm_device = NOTIFICATION_APP.model_url.gcm_device;

}
