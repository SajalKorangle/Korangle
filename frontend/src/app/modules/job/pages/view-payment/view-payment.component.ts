import { Component, Input, OnInit } from '@angular/core';

import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { SalaryOldService } from '../../../../services/modules/salary/salary-old.service';
import { ViewPaymentServiceAdapter } from './view-payment.service.adapter';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'view-payment',
    templateUrl: './view-payment.component.html',
    styleUrls: ['./view-payment.component.css'],
    providers: [EmployeeOldService, SalaryOldService],
})
export class ViewPaymentComponent implements OnInit {
    user;

    recordList = null;

    number = 10;

    isLoading = false;

    constructor(public employeeService: EmployeeOldService, public salaryService: SalaryOldService) {}

    serviceAdapter = new ViewPaymentServiceAdapter();

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.getEmployeeRecord();
    }

    increaseNumber(): void {
        this.number += 5;
    }

    getBalance(): number {
        let balance = 0;
        this.recordList.forEach((record) => {
            if (record.type === 'payslip') {
                balance += record.amount;
            } else {
                balance -= record.amount;
            }
        });
        return balance;
    }
}
