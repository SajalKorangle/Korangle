import {Injectable} from '@angular/core';

import {ServiceObject} from '../../common/service-object';

@Injectable()
export class ContactService extends ServiceObject {
    protected module_url = '/contact';

    // objects urls
    public contact_details = '/create-contact-details';
}