import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../../common-service-requirements';

@Injectable()
export class EmployeeOldService extends CommonServiceRequirements {
    // Profile Image
    uploadProfileImage(file: any, data: any, token: any): Promise<any> {
        const url = '/employee/' + data['id'] + '/profile-image';
        return super.fileData(file, token, url);
    }

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

    // Employee Session Details
    createEmployeeSessionDetail(data: any, token: any): Promise<any> {
        const url = '/employee/employee-session-details';
        return super.postData(data, token, url);
    }

    updateEmployeeSessionDetail(data: any, token: any): Promise<any> {
        const url = '/employee/employee-session-details/' + data['id'];
        return super.putData(data, token, url);
    }

    getEmployeeSessionDetail(data: any, token: any): Promise<any> {
        const url = '/employee/' + data['parentEmployee'] + '/employee-session-details?sessionId=' + data['sessionId'];
        return super.getData(token, url);
    }

    getEmployeeSessionDetailList(data: any, token: any): Promise<any> {
        const url = '/employee/school/' + data['parentSchool'] + '/employee-session-details?sessionId=' + data['sessionId'];
        return super.getData(token, url);
    }

    // Employee Permission
    getEmployeePermissionList(data: any, token: any): Promise<any> {
        const url = '/employee/' + data['parentEmployee'] + '/employee-permissions';
        return super.getData(token, url)
    }

    addEmployeePermission(data: any, token: any): Promise<any> {
        const url = '/employee/employee-permissions';
        return super.postData(data, token, url);
    }

    addEmployeePermissionList(data: any, token: any): Promise<any> {
        const url = '/employee/employee-permissions/batch';
        return super.postData(data, token, url);
    }

    deleteEmployeePermission(data: any, token: any): Promise<any> {
        const url = '/employee/employee-permissions/' + data['id'];
        return super.deleteData(token, url);
    }

}
