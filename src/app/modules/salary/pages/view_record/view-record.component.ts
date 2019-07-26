import {Component, Input, OnInit} from '@angular/core';

import {EmployeeService} from '../../../employee/employee.service';
import {SalaryService} from '../../salary.service';
import { ViewRecordServiceAdapter } from './view-record.service.adapter';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'view-record',
  templateUrl: './view-record.component.html',
  styleUrls: ['./view-record.component.css'],
    providers: [
        EmployeeService, SalaryService
    ],
})

export class ViewRecordComponent implements OnInit {

    user;

    employeeList = null;

    isLoading = false;

    serviceAdapter = new ViewRecordServiceAdapter();

    constructor (public employeeService: EmployeeService,
                 public salaryService: SalaryService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.getEmployeeList();
    }

    increaseNumber(employee: any): void {
        employee.number += 5;
    }

    getSchoolBalance(): number {
        let balance = 0;
        this.employeeList.forEach(employee => {
            balance -= this.getEmployeeBalance(employee);
        });
        return balance;
    }

    getEmployeeBalance(employee: any): number {
        let balance = 0;
        employee.recordList.forEach(record => {
            if (record.type === 'payslip') {
                balance += record.amount;
            } else {
                balance -= record.amount;
            }
        });
        return balance;
    }

}
