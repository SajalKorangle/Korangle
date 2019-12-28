import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class StudentService extends ServiceObject {

    protected module_url = '/student';

    // objects urls
    public student = '/students';
    public student_section = '/student-sections';

    public school_url = '/school';
    public student_mini_profile = '/student-mini-profiles';

    getStudentMiniProfileList(data): Promise<any> {
    	let url = this.module_url + this.school_url + '/'+data['schoolDbId'] + this.student_mini_profile + '?session_id='+data['sessionDbId'];
        return super.getData(url);
    }

}
