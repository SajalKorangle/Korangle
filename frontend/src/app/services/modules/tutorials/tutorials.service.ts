import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TutorialsService extends ServiceObject {
    protected module_url = '/tutorial';

    // objects urls
    public tutorial = '/tutorial';
    public tutorial_settings = '/tutorial-settings';

    constructor(private http_class: HttpClient) {
        super(http_class);
    }
}
