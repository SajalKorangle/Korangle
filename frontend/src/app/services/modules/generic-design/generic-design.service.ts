import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MyDesignService extends ServiceObject {
    // objects urls
    protected module_url = '/generic-design';

    constructor(private http_class: HttpClient) {
        super(http_class);
    }
}
