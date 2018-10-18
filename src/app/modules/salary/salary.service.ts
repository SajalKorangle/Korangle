import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../../services/common-service-requirements';

@Injectable()
export class SalaryService extends CommonServiceRequirements {

    // Payslip
    getSchoolPayslips(data: any, token: any): Promise<any> {
        let url = '/salary/payslips/school/' + data['parentSchool'];
        return super.getData(token, url);
    }

    getEmployeePayslips(data: any, token: any): Promise<any> {
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
    getSchoolEmployeePaymentList(data: any, token: any): Promise<any> {
        let url = '/salary/employee-payments/school/'+data['parentSchool'];
        return super.getData(token, url);
    }

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

}
