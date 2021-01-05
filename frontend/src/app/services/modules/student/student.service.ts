import {Injectable} from '@angular/core';


import {ServiceObject} from '../../common/service-object';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StudentService extends ServiceObject {

    protected module_url = '/student';

    // objects urls
    public student = '/students';
    public student2 = '/students-2';
    public student_section = '/student-sections';
    public student_parameter = '/student-parameter';
    public student_parameter_value = '/student-parameter-value';

    constructor(private http_class: HttpClient) {
        super(http_class);
        this.file_list[this.student] = this.student;
        this.file_list[this.student2]= this.student2;
        this.file_list[this.student_parameter_value] = this.student_parameter_value;
    }

}
