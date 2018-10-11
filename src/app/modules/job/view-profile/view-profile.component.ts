import { Component, Input, OnInit } from '@angular/core';

import {EmployeeService} from '../../employee/employee.service';

@Component({
  selector: 'view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
    providers: [ EmployeeService ],
})

export class ViewProfileComponent implements OnInit {

    @Input() user;

    @Input() employeeId;

    selectedEmployee: any;

    busStopList = [];

    isLoading = false;

    constructor (private employeeService: EmployeeService) { }

    ngOnChanges(): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.selectedEmployee = null;

        this.busStopList = [];

        this.isLoading = false;

        this.getEmployeeProfile();
    }

    getEmployeeProfile(): void {
        this.isLoading = true;
        const data = {
            'id': this.user.activeSchool.employeeId,
        };
        this.employeeService.getEmployeeProfile(data, this.user.jwt).then(
            employee => {
                this.isLoading = false;
                console.log(employee);
                this.selectedEmployee = employee;
            }, error => {
                this.isLoading = false;
            }
        );
    }

}
