import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {EmployeeService} from '../../employee.service';
import {map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {error} from '@angular/compiler/src/util';
import {EmitterService} from '../../../../services/emitter.service';

export class ColumnFilter {
    showName = true;
    showEmployeeId = true;
    showJobTitle = true;
    showAddress = true;
    showMobileNumber = true;
    showFatherName = false;
    showMotherName = false;
    showDateOfBirth = false;
    showGender = false;
    showAadharNumber = false;
    showPanNumber = false;
}

@Component({
    selector: 'i-cards',
    templateUrl: './i-cards.component.html',
    styleUrls: ['./i-cards.component.css'],
    providers: [ColumnFilter],
})

export class ICardsComponent implements OnInit {

    @Input() user;

    // Gender options
    maleSelected = true;
    femaleSelected = true;
    otherGenderSelected = false;

    // Spin spinner
    isLoading = false;

    // Employee list
    employeeProfileList = [];

    timeout: any;

    constructor(private employeeService: EmployeeService ,
                private columnFilter: ColumnFilter) {
    }

    ngOnInit(): void {
       const data = {
           'parentSchool': this.user.activeSchool.dbId,
       };
       this.isLoading = true;
       this.employeeService.getEmployeeProfileList(data , this.user.jwt).then(employeeList => {
           this.isLoading = false;
           this.employeeProfileList = employeeList.filter(employee => {
               return employee.dateOfLeaving === null;
           });
       }, error => {
           this.isLoading = false;
       });
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
        this.employeeProfileList.forEach(row => {
            if (row.selected) {
                selectedEmployee++;
            }
        })
        return selectedEmployee;
    }

    selectAllStudents() {
        this.employeeProfileList.forEach(row => {
            row.selected = true;
        });
    }

    unSelectAllStudents() {
        this.employeeProfileList.forEach(row => {
            row.selected = false;
        });
    }

    printEmployeeICards(): void {
        const employeeProfileList = this.employeeProfileList.filter(employee => {
            return (employee.selected);
        });
        console.log(employeeProfileList);
        EmitterService.get('print-employee-i-cards').emit(employeeProfileList);
    };
}
