import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class OnlineClassService extends ServiceObject {
    protected module_url = '/online-class';

    // objects urls
    public online_class = '/online-class';
    public zoom_auth_data = '/zoom-auth-data';
    public zoom_metting_signature = '/zoom-metting-signature';

}
