import {Injectable} from '@angular/core';

import { MockServiceObject } from '@mock-services/common/mock-service-object';
import { STUDENT_APP } from '@urls/student.url';


@Injectable()
export class StudentMockService extends MockServiceObject {

    public app_url = STUDENT_APP.url;

    // objects urls
    public student = STUDENT_APP.model_url.student;
    public student_section = STUDENT_APP.model_url.student_section;
    public student_parameter = STUDENT_APP.model_url.student_parameter;
    public student_parameter_value = STUDENT_APP.model_url.student_parameter_value;

}
