import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class NotificationService extends ServiceObject {
    public module_url = '/notification';

    // objects urls
    public gcm_device = '/gcm-devices';
    public notification = '/notifications';
}
