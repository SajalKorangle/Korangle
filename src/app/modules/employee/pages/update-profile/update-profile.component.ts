import { Component, Input, OnInit } from '@angular/core';

import { EmployeeService } from '../../employee.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

@Component({
  selector: 'update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
})

export class UpdateProfileComponent implements OnInit {

    @Input() user;

    employeeList: any;
    filteredEmployeeList: any;

    selectedEmployeeProfile: any;
    currentEmployeeProfile: any;

    selectedEmployeeSessionProfile: any;
    currentEmployeeSessionProfile: any;

    myControl = new FormControl();

    isLoading = false;

    constructor (private employeeService: EmployeeService) { }

    ngOnInit(): void {

        this.currentEmployeeProfile = {};
        this.currentEmployeeSessionProfile = {};

        const data = {
            parentSchool: this.user.activeSchool.dbId,
        };

        this.employeeService.getEmployeeMiniProfileList(data, this.user.jwt).then( employeeList => {
            this.employeeList = employeeList;
            this.filteredEmployeeList = this.myControl.valueChanges.pipe(
                map(value => typeof value === 'string' ? value: (value as any).name),
                map(value => this.filter(value))
            );
        });

    }

    filter(value: any): any {
        if (value === '') {
            return [];
        }
        return this.employeeList.filter( member => member.name.toLowerCase().indexOf(value.toLowerCase()) === 0 );
    }

    displayFn(member?: any) {
        if (member) {
            return member.name;
        } else {
            return '';
        }
    }

    getEmployeeProfile(employee: any): void {

        const data = {
            id: employee.id,
        };

        const session_data = {
            sessionId: this.user.activeSchool.currentSessionDbId,
            parentEmployee: employee.id,
        };

        this.isLoading = true;
        Promise.all([
            this.employeeService.getEmployeeProfile(data, this.user.jwt),
            this.employeeService.getEmployeeSessionDetail(session_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            this.selectedEmployeeProfile = value[0];
            Object.keys(this.selectedEmployeeProfile).forEach(key => {
                this. currentEmployeeProfile[key] = this.selectedEmployeeProfile[key];
            });
            this.selectedEmployeeSessionProfile = value[1];
            Object.keys(this.selectedEmployeeSessionProfile).forEach(key => {
                this.currentEmployeeSessionProfile[key] = this.selectedEmployeeSessionProfile[key];
            });
        }, error => {
            this.isLoading = false;
        });

    }

    updateEmployeeProfile(): void {

        if (this.currentEmployeeProfile.name === undefined || this.currentEmployeeProfile.name === '') {
            alert('Name should be populated');
            return;
        }

        if (this.currentEmployeeProfile.fatherName === undefined || this.currentEmployeeProfile.fatherName === '') {
            alert('Father\'s Name should be populated');
            return;
        }

        if (this.currentEmployeeProfile.dateOfBirth === undefined || this.currentEmployeeProfile.dateOfBirth === '') {
            this.currentEmployeeProfile.dateOfBirth = null;
        }

        if (this.currentEmployeeProfile.dateOfJoininig === undefined || this.currentEmployeeProfile.dateOfJoining === '') {
            this.currentEmployeeProfile.dateOfJoining = null;
        }

        if (this.currentEmployeeProfile.dateOfLeaving === undefined || this.currentEmployeeProfile.dateOfLeaving === '') {
            this.currentEmployeeProfile.dateOfLeaving = null;
        }

        if (this.currentEmployeeProfile.mobileNumber === undefined || this.currentEmployeeProfile.mobileNumber === '') {
            this.currentEmployeeProfile.mobileNumber = null;
            alert('Mobile number is required.');
            return;
        } else {
            let selectedEmployee = null;
            this.employeeList.forEach(employee => {
                if (employee.mobileNumber === this.currentEmployeeProfile.mobileNumber
                    && employee.id !== this.currentEmployeeProfile.id) {
                    selectedEmployee = employee;
                }
            });
            if (selectedEmployee) {
                alert('Mobile Number already exists in '+selectedEmployee.name+'\'s profile');
                return;
            }
        }

        this.isLoading = true;
        Promise.all([
            this.employeeService.updateEmployeeProfile(this.currentEmployeeProfile, this.user.jwt),
            (this.currentEmployeeSessionProfile.id==null?
                this.employeeService.createEmployeeSessionDetail(this.currentEmployeeSessionProfile, this.user.jwt)
                    :this.employeeService.updateEmployeeSessionDetail(this.currentEmployeeSessionProfile, this.user.jwt)
            )
        ]).then(value => {
            this.isLoading = false;
            alert('Employee profile updated successfully');
            this.selectedEmployeeProfile = this.currentEmployeeProfile;
            this.selectedEmployeeSessionProfile = this.currentEmployeeSessionProfile;
        }, error => {
            this.isLoading = false;
        });

    }

}
