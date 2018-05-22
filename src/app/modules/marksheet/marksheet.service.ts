import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from '../../services/common-service-requirements';

@Injectable()
export class MarksheetService extends CommonServiceRequirements {

    // Variables

    /* Update Marks */
    // private getMarksUrl = '/examinations/sections/id/students/id/results';
    private updateMarksUrl = '/examinations/result';

    /* Print Marksheet */
    private getMarksheetUrl = '/examinations/sections/id/students/id/marksheets';

    // Functions

    /* Get Subject List */
    getSubjectList(token: any): Promise<any> {
        const url = '/subjects';
        return super.getData(token, url);
    }

    /* Get MaximumMarks Allowed List */
    getMaximumMarksAllowedList(token: any): Promise<any> {
        const url = '/examinations/maximumMarksAllowed';
        return super.getData(token, url);
    }

    /* Update Marks */
    getMarksUrl(data: any, token: any): Promise<any> {
        const url = '/examinations/sections/' + data['sectionDbId'] + '/students/' + data['studentDbId'] + '/results';
        return super.getData(token, url);
    }

    updateMarks(data: any, token: any): Promise<any> {
        return super.postData(data, token, this.updateMarksUrl);
    }

    /* Print Marksheet */
    getStudentMarksheet(data: any, token: any): Promise<any> {
        const url = '/examinations/sections/' + data['sectionDbId'] + '/students/' + data['studentDbId'] + '/marksheets';
        return super.getData(token, url);
    }

}
