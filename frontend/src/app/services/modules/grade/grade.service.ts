import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class GradeService extends ServiceObject {
    protected module_url = '/grade';

    // objects urls
    public grade = '/grades';
    public sub_grade = '/sub-grades';
    public student_sub_grade = '/student-sub-grades';
}
