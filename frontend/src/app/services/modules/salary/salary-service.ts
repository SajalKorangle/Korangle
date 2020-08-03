import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class SalaryService extends ServiceObject {

    protected module_url = '/salary';

    // objects urls
    public payslip = '/payslip';
    public employee_payment = '/employee-payment';
}
