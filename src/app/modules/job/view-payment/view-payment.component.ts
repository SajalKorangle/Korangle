import { Component, Input, OnInit } from '@angular/core';

import {EmployeeService} from '../../employee/employee.service';
import {SalaryService} from '../../salary/salary.service';
import {ViewPaymentServiceAdapter} from './view-payment.service.adapter';

@Component({
  selector: 'view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.css'],
    providers: [ EmployeeService, SalaryService ],
})

export class ViewPaymentComponent implements OnInit {

    @Input() user;

    recordList = null;

    number = 10;

    isLoading = false;

    constructor (public employeeService: EmployeeService,
                 public salaryService: SalaryService) { }

    serviceAdapter = new ViewPaymentServiceAdapter();

    ngOnInit(): void {
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.getEmployeeRecord();
    }

    increaseNumber(): void {
        this.number += 5;
    }

    getBalance(): number {
        let balance = 0;
        this.recordList.forEach(record => {
            if (record.type === 'payslip') {
                balance += record.amount;
            } else {
                balance -= record.amount;
            }
        });
        return balance;
    }

}
