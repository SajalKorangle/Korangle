import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from '../../services/common-service-requirements';

@Injectable()
export class EmployeeService extends CommonServiceRequirements {

    // Employee Profile
    createEmployeeProfile(data: any, token: any): Promise<any> {
        const url = '/employee/employee-profiles';
        return super.postData(data, token, url);
    }

    getEmployeeProfile(data: any, token: any): Promise<any> {
        const url = '/employee/employee-profiles/' + data['id'];
        return super.getData(token, url);
    }

    getEmployeeProfileList(data: any, token: any): Promise<any> {
        const url = '/employee/school/' + data['parentSchool'] + '/employee-profiles';
        return super.getData(token, url);
    }

    updateEmployeeProfile(data: any, token: any): Promise<any> {
        const url = '/employee/employee-profiles/' + data['id'];
        return super.putData(data, token, url);
    }

    // Employee Mini Profile
    getEmployeeMiniProfileList(data: any, token: any): Promise<any> {
        const url = '/employee/school/' + data['parentSchool'] + '/employee-mini-profiles';
        return super.getData(token, url);
    }

}
