import { Component, Input, OnInit } from '@angular/core';

import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { GeneratePayslipServiceAdapter } from './generate-payslip.service.adapter';
import { MONTH_LIST } from '../../../../classes/constants/month';
import { AttendanceOldService } from '../../../../services/modules/attendance/attendance-old.service';
import { SalaryOldService } from '../../../../services/modules/salary/salary-old.service';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'generate-payslip',
    templateUrl: './generate-payslip.component.html',
    styleUrls: ['./generate-payslip.component.css'],
    providers: [EmployeeOldService, AttendanceOldService, SalaryOldService],
})
export class GeneratePayslipComponent implements OnInit {
    user;

    employeeList = null;

    showEmployeeDetails = false;

    selectedEmployee = null;

    employeeDetails = null;

    startDate = null;
    endDate = null;
    selectedMonth = null;
    selectedYear = null;

    serviceAdapter = new GeneratePayslipServiceAdapter();

    isInitialLoading = false;
    isLoading = false;

    constructor(
        public employeeService: EmployeeOldService,
        public attendanceService: AttendanceOldService,
        public salaryService: SalaryOldService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.getEmployeeList();
    }

    onMonthSelected(event: any): void {
        setTimeout(() => {
            let d = new Date(event);
            this.selectedMonth = MONTH_LIST[d.getMonth()];
            this.selectedYear = d.getFullYear();
            this.startDate = this.formatDate(event, 'firstDate');
            this.endDate = this.formatDate(event, 'lastDate');
            this.showEmployeeDetails = false;
        }, 100);
    }

    formatDate(dateStr: any, status: any): any {
        let d = new Date(dateStr);

        if (status === 'firstDate') {
            d = new Date(d.getFullYear(), d.getMonth(), 1);
        } else if (status === 'lastDate') {
            d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
}
