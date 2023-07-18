import { Component, Input, OnInit } from '@angular/core';
import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_EMPLOYEE_I_CARD } from '../../../../print/print-routes.constants';
import { DataStorage } from '../../../../classes/data-storage';

export class ColumnFilter {
    showName = true;
    showEmployeeNumber = true;
    showJobTitle = true;
    showAddress = true;
    showMobileNumber = true;
    showFatherName = false;
    showMotherName = false;
    showDateOfBirth = false;
    showGender = false;
    showAadharNumber = false;
    showPanNumber = false;
    showCurrentPost = false;
}

@Component({
    selector: 'i-cards',
    templateUrl: './i-cards.component.html',
    styleUrls: ['./i-cards.component.css'],
    providers: [ColumnFilter],
})
export class ICardsComponent implements OnInit {
    user;

    // Gender options
    maleSelected = true;
    femaleSelected = true;
    otherGenderSelected = false;

    // Spin spinner
    isLoading = false;

    // Employee list
    employeeProfileList = [];

    timeout: any;

    constructor(private employeeService: EmployeeOldService, public columnFilter: ColumnFilter, private printService: PrintService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        const data = {
            parentSchool: this.user.activeSchool.dbId,
        };
        this.isLoading = true;
        this.employeeService.getEmployeeProfileList(data, this.user.jwt).then(
            (employeeList) => {
                this.isLoading = false;
                this.employeeProfileList = employeeList.filter((employee) => {
                    return employee.dateOfLeaving === null;
                });
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }

    updateRowValue(row: any, value: boolean): void {
        row.selected = value;
    }

    getSelectedEmployee(): number {
        let selectedEmployee = 0;
        this.employeeProfileList.forEach((row) => {
            if (row.selected) {
                selectedEmployee++;
            }
        });
        return selectedEmployee;
    }

    selectAllEmployees() {
        this.employeeProfileList.forEach((row) => {
            row.selected = true;
        });
    }

    unSelectAllEmployees() {
        this.employeeProfileList.forEach((row) => {
            row.selected = false;
        });
    }

    printEmployeeICards(): void {
        const employeeProfileList = this.employeeProfileList.filter((employee) => {
            return employee.selected;
        });
        console.log(employeeProfileList);
        this.printService.navigateToPrintRoute(PRINT_EMPLOYEE_I_CARD, { user: this.user, value: employeeProfileList });
    }

    selectAllColumns() {
        for (let key in this.columnFilter) {
            this.columnFilter[key] = true;
        }
    }

    unSelectAllColumns() {
        for (let key in this.columnFilter) {
            this.columnFilter[key] = false;
        }
    }
}
