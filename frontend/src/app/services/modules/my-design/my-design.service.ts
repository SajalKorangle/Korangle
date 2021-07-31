import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReportCardService extends ServiceObject {
    // objects urls
    public layout = '/layout';
    public layout_sharing = '/layout-sharing';
    public image_assets = '/image-assets';

    protected module_url = '/my-design';

    constructor(private http_class: HttpClient) {
        super(http_class);
    }
}
