import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../../services/common-service-requirements';

@Injectable()
export class SalaryService extends CommonServiceRequirements {

    // Payslip
    getPayslipList(data: any, token: any): Promise<any> {
        let url = '/salary/payslips/employee/' + data['parentEmployee'];
        return super.getData(token, url);
    }

    getPayslip(data: any, token: any): Promise<any> {
        let url = '/salary/payslips';
        if (data.id) {
            url += '/' + data.id;
        } else {
            url += '/0?parentEmployee=' + data.parentEmployee + '&month=' + data.month + '&year=' + data.year;
        }
        return super.getData(token, url);
    }

    createPayslip(data: any, token: any): Promise<any> {
        const url = '/salary/payslips';
        return super.postData(data, token, url);
    }

    editPayslip(data: any, token: any): Promise<any> {
        const url = '/salary/payslips/' + data['id'];
        return super.putData(data, token, url);
    }

    deletePayslip(data: any, token: any): Promise<any> {
        const url = '/salary/payslips/' + data['id'];
        return super.deleteData(token, url);
    }

    // Employee Payment
    getEmployeePaymentList(data: any, token: any): Promise<any> {
        let url = '/salary/employee-payments/employee/'+data['parentEmployee'];
        return super.getData(token, url);
    }

    createEmployeePayment(data: any, token: any): Promise<any> {
        const url = '/salary/employee-payments';
        return super.postData(data, token, url);
    }

    deleteEmployeePayment(data: any, token: any): Promise<any> {
        const url = '/salary/employee-payments/' + data['id'];
        return super.deleteData(token, url);
    }

    // Employee Payment

    /*
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
        return super.postData(data, token, url);
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

    deleteEmployeePermission(data: any, token: any): Promise<any> {
        const url = '/employee/employee-permissions/' + data['id'];
        return super.deleteData(token, url);
    }
    */

}
