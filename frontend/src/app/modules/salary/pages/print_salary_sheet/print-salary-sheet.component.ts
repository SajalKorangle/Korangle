import { Component, Input, OnInit } from '@angular/core';

import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { PrintSalarySheetServiceAdapter } from './print-salary-sheet.service.adapter';
import { MONTH_LIST } from '../../../../classes/constants/month';
import { AttendanceOldService } from '../../../../services/modules/attendance/attendance-old.service';
import { SalaryOldService } from '../../../../services/modules/salary/salary-old.service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_SALARY_SHEET } from '../../../../print/print-routes.constants';
import { DataStorage } from '../../../../classes/data-storage';
import xlsx = require('xlsx');

@Component({
    selector: 'app-print-salary-sheet',
    templateUrl: './print-salary-sheet.component.html',
    styleUrls: ['./print-salary-sheet.component.css'],
    providers: [EmployeeOldService, AttendanceOldService, SalaryOldService],
})
export class PrintSalarySheetComponent implements OnInit {
    user;

    employeeList = null;
    columnHeaderList = ["S.No", "Name", "Father's/Husband's Name", "Monthly Salary",
        "Working Days", "Net Salary", "Signature"];

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

    downloadExcel(): void {
        let headerRowAndSalaryList = [];
        //pushing Header List
        headerRowAndSalaryList.push(this.columnHeaderList);
        this.getFilteredEmployeeList().forEach((employee, index) => {
            // pushing each Row of the Employee Salary Details according to the Headers
            headerRowAndSalaryList.push([index + 1, employee.name, employee.fatherName, employee.monthlySalary,
                employee.numberOfWorkingDays, employee.netSalary]);
        });
        let workSheet = xlsx.utils.aoa_to_sheet(headerRowAndSalaryList);
        // formatting width of columns according to the data present
        workSheet['!cols'] = this.fitToColumn(headerRowAndSalaryList);
        let workBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
        // downloads the file
        xlsx.writeFile(workBook, "Salary-Sheet(" + this.selectedMonth + "-" + this.selectedYear + ").xlsx");
    }

    fitToColumn(contentOfExcel) {
        // get maximum character of each column
        return contentOfExcel[0].map((a, i) => ({wch: Math.max(...contentOfExcel.map(a2 => a2[i] ? a2[i].toString().length : 0))}));
    }
}
