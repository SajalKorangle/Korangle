import {Injectable} from '@angular/core';


import {ServiceObject} from "./common/service-object";

@Injectable()
export class ExaminationService extends ServiceObject {

    protected module_url = '/examinations';

    // objects urls
    public examination = '/examination';
    public test_second = '/test-second';
    public student_test = '/student-test';

}
