import {Injectable} from '@angular/core';


import {ReportCardService} from "../report-card.service";
import {TERM_LIST} from "./term";
import {EXTRA_FIELD_LIST} from "./extra-field";

@Injectable()
export class ReportCardCbseService extends ReportCardService {

    private cbse_url = '/cbse';

    // objects urls
    public term = this.cbse_url+'/term';
    public extra_field = this.cbse_url+'/extra-field';
    public student_extra_field = this.cbse_url+'/student-extra-field';
    public class_teacher_remark = this.cbse_url+'/class-teacher-remark';
    public report_card_mapping = this.cbse_url+'/report-card-mapping';

    constructor() {
        super();
        this.constant_list[this.term] = TERM_LIST;
        this.constant_list[this.extra_field] = EXTRA_FIELD_LIST;
    }

}
