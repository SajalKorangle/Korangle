import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OnlineClassService extends ServiceObject {
    protected module_url = '/online-class';

    // objects urls
    public active_class = '/active-class';

    constructor(private http_class: HttpClient) {
        super(http_class);
    }
}
