import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import {EmployeeService} from '../../modules/employee/employee.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-employee-filter',
    templateUrl: './employee-filter.component.html',
    styleUrls: ['./employee-filter.component.css'],
    providers: [ EmployeeService ],
})

export class EmployeeFilterComponent implements OnInit {

    @Input() user;

    @Input() showAllEmployees;

    @Output() emitEmployeeList = new EventEmitter <any>();

    @Output() employee = new EventEmitter <any>();

    myControl = new FormControl();

    employeeList: any;
    filteredEmployeeList: any;

    isLoading = false;

    constructor (private employeeService: EmployeeService) { }

    ngOnInit(): void {
        const data = {
            parentSchool: this.user.activeSchool.dbId,
        };

        this.employeeService.getEmployeeMiniProfileList(data, this.user.jwt).then( employeeList => {
            this.employeeList = employeeList;
            this.filteredEmployeeList = this.myControl.valueChanges.pipe(
                map(value => typeof value === 'string' ? value : (value as any).name),
                map(value => this.filter(value))
            );
            this.emitEmployeeList.emit(this.employeeList);
        });

    }

    filter(value: any): any {
        if (value === '') {
            return [];
        }
        if (this.showAllEmployees) {
            return this.employeeList.filter(employee => {
                return employee.name.toLowerCase().indexOf(value.toLowerCase()) === 0;
            });
        } else {
            return this.employeeList.filter(employee => {
                return employee.name.toLowerCase().indexOf(value.toLowerCase()) === 0 && employee.dateOfLeaving === null;
            });
        }
    }

    getEmployee(employee: any) {
        this.employee.emit(employee);
    }

    displayFn(member?: any) {
        if (member) {
            return member.name;
        } else {
            return '';
        }
    }

}
