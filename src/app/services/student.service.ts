import {Injectable} from '@angular/core';


import {ServiceObject} from "./common/service-object";

@Injectable()
export class StudentService extends ServiceObject {

    protected module_url = '/student';

    // objects urls
    public student = '/students';
    public student_section = '/student-sections';
    public student_multiple_session_check = '/multiple_session_check';

}
