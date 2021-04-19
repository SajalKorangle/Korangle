import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventGalleryService extends ServiceObject {
    protected module_url = '/event-gallery';

    // objects urls
    public event = '/event';
    public event_image = '/event-image';
    public event_tag = '/event-tag';
    public event_image_tag = '/event-image-tag';
    public event_notify_class = '/event-notify-class';

    constructor(private http_class: HttpClient) {
        super(http_class);
    }
}
