import {Component, Input, OnInit} from '@angular/core';

import { EmployeeService } from '../../employee.service';

class ColumnFilter {
    showSerialNumber = true;
    showName = true;
    showEmployeeNumber = false;
    showFatherName = true;
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

    constructor(private employeeService: EmployeeService) { }

    ngOnInit(): void {

        this.columnFilter = new ColumnFilter();

        let data = {
            'parentSchool': this.user.activeSchool.dbId,
        };

        this.isLoading = true;
        this.employeeService.getEmployeeProfileList(data, this.user.jwt).then(employeeProfileList => {
            this.isLoading = false;
            this.employeeProfileList = employeeProfileList;
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

}
