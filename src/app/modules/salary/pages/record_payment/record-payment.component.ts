import {Component, Input, OnInit} from '@angular/core';

import {EmployeeService} from '../../../employee/employee.service';
import {SalaryService} from '../../salary.service';
import {RecordPaymentServiceAdapter} from './record-payment.service.adapter';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'record-payment',
  templateUrl: './record-payment.component.html',
  styleUrls: ['./record-payment.component.css'],
    providers: [
        EmployeeService, SalaryService
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

    constructor (public employeeService: EmployeeService,
                 public salaryService: SalaryService) { }

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
