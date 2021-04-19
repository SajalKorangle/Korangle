import { Component, Input, OnInit } from '@angular/core';

import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'view-profile',
    templateUrl: './view-profile.component.html',
    styleUrls: ['./view-profile.component.css'],
    providers: [EmployeeOldService],
})
export class ViewProfileComponent implements OnInit {
    user;

    selectedEmployee: any;

    busStopList = [];

    isLoading = false;

    constructor(private employeeService: EmployeeOldService) {}

    ngOnChanges(): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.selectedEmployee = null;

        this.busStopList = [];

        this.isLoading = false;

        this.getEmployeeProfile();
    }

    getEmployeeProfile(): void {
        this.isLoading = true;
        const data = {
            id: this.user.activeSchool.employeeId,
        };
        this.employeeService.getEmployeeProfile(data, this.user.jwt).then(
            (employee) => {
                this.isLoading = false;
                console.log(employee);
                this.selectedEmployee = employee;
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }
}
