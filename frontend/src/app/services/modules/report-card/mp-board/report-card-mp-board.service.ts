import {Injectable} from '@angular/core';


import {ReportCardService} from "../report-card.service";
import {HttpClient} from "@angular/common/http";
import {EXTRA_FIELD_CONSTANT} from "./models/extra-field";
import {EXTRA_SUB_FIELD_CONSTANT} from "./models/extra-sub-field";

@Injectable()
export class ReportCardMpBoardService extends ReportCardService {

    private mp_board_url = '/mp-board';

    // objects urls
    public report_card_mapping = this.mp_board_url+'/report-card-mapping';
    public cce_marks = this.mp_board_url+'/cce-marks';
    public student_extra_sub_field = this.mp_board_url+'/student-extra-sub-field';
    public extra_field = this.mp_board_url+'/extra-field';
    public extra_sub_field = this.mp_board_url+'extra-sub-field';
    public student_remark = this.mp_board_url+'/student-remark';

    constructor(private http_report_card_mp_board: HttpClient) {
        super(http_report_card_mp_board);
        this.constant_list[this.extra_field] = EXTRA_FIELD_CONSTANT;
        this.constant_list[this.extra_sub_field] = EXTRA_SUB_FIELD_CONSTANT;
    }

}
