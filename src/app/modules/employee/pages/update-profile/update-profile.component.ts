import { Component, Input, OnInit } from '@angular/core';

import { EmployeeService } from '../../employee.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators/map';

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

    myControl = new FormControl();

    isLoading = false;

    constructor (private employeeService: EmployeeService) { }

    ngOnInit(): void {

        this.currentEmployeeProfile = {};

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

        this.isLoading = true;
        this.employeeService.getEmployeeProfile(data, this.user.jwt).then( employeeProfile => {
            this.isLoading = false;
            this.selectedEmployeeProfile = employeeProfile;
            Object.keys(this.selectedEmployeeProfile).forEach(key => {
                this.currentEmployeeProfile[key] = this.selectedEmployeeProfile[key];
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

        let id = this.currentEmployeeProfile.id;

        this.isLoading = true;
        this.employeeService.updateEmployeeProfile(this.currentEmployeeProfile, this.user.jwt).then(message => {
            this.isLoading = false;
            alert(message);
            if (this.selectedEmployeeProfile.id === id) {
                this.selectedEmployeeProfile = this.currentEmployeeProfile;
            }
        }, error => {
            this.isLoading = false;
        });

    }

}
