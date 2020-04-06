import {Component, Input, OnInit} from '@angular/core';

import {EmployeeOldService} from '../../../../services/modules/employee/employee-old.service';
import {SalaryOldService} from '../../../../services/modules/salary/salary-old.service';
import {RecordPaymentServiceAdapter} from './record-payment.service.adapter';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'record-payment',
  templateUrl: './record-payment.component.html',
  styleUrls: ['./record-payment.component.css'],
    providers: [
        EmployeeOldService, SalaryOldService
    ],
})

export class RecordPaymentComponent implements OnInit {

    user;

    employeeList = null;

    selectedEmployee = null;

    employeeDetails = null;

    number = 10;

    employeeRecordList = null;

    isInitialLoading = false;
    isLoading = false;

    serviceAdapter = new RecordPaymentServiceAdapter();

    constructor (public employeeService: EmployeeOldService,
                 public salaryService: SalaryOldService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.getEmployeeList();
    }

    increaseNumber(): void {
        this.number += 5;
    }

    getBalance(): number {
        let balance = 0;
        this.employeeRecordList.forEach(record => {
            if (record.type === 'payslip') {
                balance += record.amount;
            } else {
                balance -= record.amount;
            }
        });
        return balance;
    }

}
