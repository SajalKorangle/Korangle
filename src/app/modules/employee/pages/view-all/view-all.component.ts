import {Component, Input, OnInit} from '@angular/core';

import { EmployeeService } from '../../employee.service';

import { PrintService } from '../../../../print/print-service';
import { PRINT_EMPLOYEE_LIST } from '../../../../print/print-routes.constants';
import {ExcelService} from "../../../../excel/excel-service";

class ColumnFilter {
    showSerialNumber = true;
    showName = true;
    showEmployeeNumber = false;
    showFatherName = true;
    showSpouseName = false;
    showMobileNumber = true;
    showDateOfBirth = false;
    showMotherName = false;
    showAadharNumber = false;
    showPassportNumber = false;
    showQualification = false;
    showCurrentPost = false;
    showDateOfJoining = false;
    showPanNumber = false;
    showGender = false;
    showAddress = true;
    showBankName = false;
    showBankAccountNumber = false;
    showEpfAccountNumber = false;
    showMonthlySalary = false;
    showPranNumber = false;
    showRemark = false;
}

@Component({
    selector: 'view-all',
    templateUrl: './view-all.component.html',
    styleUrls: ['./view-all.component.css'],
})

export class ViewAllComponent implements OnInit {

    @Input() user;

    columnFilter: ColumnFilter;

    employeeProfileList = [];

    isLoading = false;

    constructor(private employeeService: EmployeeService,
                private excelService: ExcelService,
                private printService: PrintService) { }

    ngOnInit(): void {

        this.columnFilter = new ColumnFilter();

        let data = {
            'parentSchool': this.user.activeSchool.dbId,
        };

        this.isLoading = true;
        this.employeeService.getEmployeeProfileList(data, this.user.jwt).then(employeeProfileList => {
            this.isLoading = false;
            this.employeeProfileList = employeeProfileList.filter(employee => {
                return employee.dateOfLeaving === null;
            });
        }, error => {
            this.isLoading = false;
        });

    }

    selectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = true;
        });
    };

    unSelectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = false;
        });
    };

    printEmployeeList(): void {
        const value = {
            employeeList: this.employeeProfileList,
            columnFilter: this.columnFilter,
        };
        this.printService.navigateToPrintRoute(PRINT_EMPLOYEE_LIST, {user: this.user, value});
    };

    downloadList(): void {

        let template: any;

        template = [

            this.getHeaderValues(),

        ];

        this.employeeProfileList.forEach(employee => {
            template.push(this.getEmployeeDisplayInfo(employee));
        });

        this.excelService.downloadFile(template, 'korangle_employees.csv');
    }

    getHeaderValues(): any {
        let headerValues = [];
        (this.columnFilter.showName)? headerValues.push('Name'): '';
        (this.columnFilter.showEmployeeNumber)? headerValues.push('Employee Number'): '';
        (this.columnFilter.showFatherName)? headerValues.push('Father\'s Name'): '';
        (this.columnFilter.showSpouseName)? headerValues.push('Spouse\'s Name'): '';
        (this.columnFilter.showMobileNumber)? headerValues.push('Mobile No.'): '';
        (this.columnFilter.showDateOfBirth)? headerValues.push('Date of Birth'): '';
        (this.columnFilter.showMotherName)? headerValues.push('Mother\'s Name'): '';
        (this.columnFilter.showGender)? headerValues.push('Gender'): '';
        (this.columnFilter.showAadharNumber)? headerValues.push('Aadhar No.'): '';
        (this.columnFilter.showPassportNumber)? headerValues.push('Passport No.'): '';
        (this.columnFilter.showQualification)? headerValues.push('Qualification'): '';
        (this.columnFilter.showCurrentPost)? headerValues.push('Current Post'): '';
        (this.columnFilter.showDateOfJoining)? headerValues.push('Date of Joining'): '';
        (this.columnFilter.showPanNumber)? headerValues.push('Pan Number'): '';
        (this.columnFilter.showGender)? headerValues.push('Gender'): '';
        (this.columnFilter.showAddress)? headerValues.push('Address'): '';
        (this.columnFilter.showBankName)? headerValues.push('Bank Name'): '';
        (this.columnFilter.showBankAccountNumber)? headerValues.push('Bank Account Number'): '';
        (this.columnFilter.showEpfAccountNumber)? headerValues.push('Epf Account Number'): '';
        (this.columnFilter.showMonthlySalary)? headerValues.push('Monthly Salary'): '';
        (this.columnFilter.showPranNumber)? headerValues.push('PRAN Number'): '';
        (this.columnFilter.showRemark)? headerValues.push('Remark'): '';

        return headerValues;
    }

     getEmployeeDisplayInfo(employee: any): any {
        let employeeDisplay = [];

        (this.columnFilter.showName)? employeeDisplay.push(employee.name): '';
        (this.columnFilter.showEmployeeNumber)? employeeDisplay.push(employee.employeeNumber): '';
        (this.columnFilter.showFatherName)? employeeDisplay.push(employee.fatherName): '';
        (this.columnFilter.showSpouseName)? employeeDisplay.push(employee.spouseName): '';
        (this.columnFilter.showMobileNumber)? employeeDisplay.push(employee.mobileNumber): '';
        (this.columnFilter.showDateOfBirth)? employeeDisplay.push(employee.dateOfBirth): '';
        (this.columnFilter.showMotherName)? employeeDisplay.push(employee.motherName): '';
        (this.columnFilter.showGender)? employeeDisplay.push(employee.gender): '';
        (this.columnFilter.showAadharNumber)? employeeDisplay.push(employee.aadharNumber): '';
        (this.columnFilter.showPassportNumber)? employeeDisplay.push(employee.passportNumber): '';
        (this.columnFilter.showQualification)? employeeDisplay.push(employee.qualification): '';
        (this.columnFilter.showCurrentPost)? employeeDisplay.push(employee.currentPost): '';
        (this.columnFilter.showDateOfJoining)? employeeDisplay.push(employee.dateOfJoining): '';
        (this.columnFilter.showPanNumber)? employeeDisplay.push(employee.panNumber): '';
        (this.columnFilter.showGender)? employeeDisplay.push(employee.gender): '';
        (this.columnFilter.showAddress)? employeeDisplay.push(employee.address): '';
        (this.columnFilter.showBankName)? employeeDisplay.push(employee.bankName): '';
        (this.columnFilter.showBankAccountNumber)? employeeDisplay.push(employee.bankAccountNumber): '';
        (this.columnFilter.showEpfAccountNumber)? employeeDisplay.push(employee.epfAccountNumber): '';
        (this.columnFilter.showMonthlySalary)? employeeDisplay.push(employee.monthlySalary): '';
        (this.columnFilter.showPranNumber)? employeeDisplay.push(employee.pranNumber): '';
        (this.columnFilter.showRemark)? employeeDisplay.push(employee.remark): '';

        return employeeDisplay;
    }

}
