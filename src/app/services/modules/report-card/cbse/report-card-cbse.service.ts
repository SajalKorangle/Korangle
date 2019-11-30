import {Injectable} from '@angular/core';


import {ReportCardService} from "../report-card.service";
import {TERM_LIST} from "./models/term";
import {EXTRA_FIELD_LIST} from "./models/extra-field";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ReportCardCbseService extends ReportCardService {

    private cbse_url = '/cbse';

    // objects urls
    public term = this.cbse_url+'/term';
    public extra_field = this.cbse_url+'/extra-field';
    public student_extra_field = this.cbse_url+'/student-extra-field';
    public student_remark = this.cbse_url+'/student-remark';
    public report_card_mapping = this.cbse_url+'/report-card-mapping';

    constructor(private http_report_card_cbse: HttpClient) {
        super(http_report_card_cbse);
        this.constant_list[this.term] = TERM_LIST;
        this.constant_list[this.extra_field] = EXTRA_FIELD_LIST;
    }

}
