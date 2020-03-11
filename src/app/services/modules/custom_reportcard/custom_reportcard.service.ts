import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class CustomReportCardService extends ServiceObject {

    protected module_url = '/custom_reportcard';

    // objects urls
    public layout = '/layouts';
    public student_remarks = '/student-remarks';

    public layout_exam_column = '/layout-exam-columns';

}
