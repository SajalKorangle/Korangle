import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class EnquiryService extends ServiceObject {
    protected module_url = '/enquiry';

    // objects urls
    public enquiry = '/enquiry';
}
