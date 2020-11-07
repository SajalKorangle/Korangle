import {Injectable} from '@angular/core';


import {ServiceObject} from '../../common/service-object';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ReportCardService extends ServiceObject {

    // objects urls
    public report_card_layout = '/report-card-layout';

    protected module_url = '/report-card';

    constructor(private http_class: HttpClient) {
        super(http_class);
        this.file_list[this.report_card_layout] = this.report_card_layout;
    }

}
