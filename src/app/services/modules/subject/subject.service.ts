import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class SubjectService extends ServiceObject {

    protected module_url = '/subject';

    // objects urls
    public class_subject = '/class-subject';
    public student_subject = '/student-subject';

}
