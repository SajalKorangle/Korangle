import { Component, Input, OnInit } from '@angular/core';

import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { PrintSalarySheetServiceAdapter } from './print-salary-sheet.service.adapter';
import { MONTH_LIST } from '../../../../classes/constants/month';
import { AttendanceOldService } from '../../../../services/modules/attendance/attendance-old.service';
import { SalaryOldService } from '../../../../services/modules/salary/salary-old.service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_SALARY_SHEET } from '../../../../print/print-routes.constants';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'app-print-salary-sheet',
    templateUrl: './print-salary-sheet.component.html',
    styleUrls: ['./print-salary-sheet.component.css'],
    providers: [EmployeeOldService, AttendanceOldService, SalaryOldService],
})
export class PrintSalarySheetComponent implements OnInit {
    user;

    employeeList = null;

    startDate = null;
    endDate = null;
    selectedMonth = null;
    selectedYear = null;

    serviceAdapter = new PrintSalarySheetServiceAdapter();

    isLoading = true;

    constructor(
        public employeeService: EmployeeOldService,
        public attendanceService: AttendanceOldService,
        public salaryService: SalaryOldService,
        private printService: PrintService
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
            if (this.employeeList) {
                this.serviceAdapter.getInfoForSalary();
            }
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

    getFilteredEmployeeList(): any {
        return this.employeeList.filter((employee) => {
            return employee['netSalary'] !== null;
        });
    }

    printSalarySheet(): void {
        let value = {
            employeeList: this.employeeList.filter((item) => {
                return item.netSalary !== null;
            }),
            month: this.selectedMonth,
            year: this.selectedYear,
        };
        this.printService.navigateToPrintRoute(PRINT_SALARY_SHEET, { user: this.user, value });
    }
}
