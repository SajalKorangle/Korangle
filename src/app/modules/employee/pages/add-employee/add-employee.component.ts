import {Component, Input, OnInit} from '@angular/core';

import { EmployeeService } from '../../employee.service';

@Component({
  selector: 'add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})

export class AddEmployeeComponent implements OnInit {

    @Input() user;

    newEmployee: any;
    newEmployeeSessionDetail: any;

    employeeList = [];

    isLoading = false;

    constructor (private employeeService: EmployeeService) { }

    ngOnInit(): void {
        this.newEmployee = {};
        this.newEmployeeSessionDetail = {};
        let data = {
            parentSchool: this.user.activeSchool.dbId,
        };
        this.employeeService.getEmployeeMiniProfileList(data, this.user.jwt).then(employeeList => {
            this.employeeList = employeeList;
        });
    }

    createNewEmployee(): void {

        if (this.newEmployee.name === undefined || this.newEmployee.name === '') {
            alert('Name should be populated');
            return;
        }

        if (this.newEmployee.fatherName === undefined || this.newEmployee.fatherName === '') {
            alert('Father\'s Name should be populated');
            return;
        }

        if (this.newEmployee.dateOfBirth === undefined || this.newEmployee.dateOfBirth === '') {
            this.newEmployee.dateOfBirth = null;
        }

        if (this.newEmployee.dateOfJoininig === undefined || this.newEmployee.dateOfJoining === '') {
            this.newEmployee.dateOfJoining = null;
        }

        if (this.newEmployee.dateOfLeaving === undefined || this.newEmployee.dateOfLeaving === '') {
            this.newEmployee.dateOfLeaving = null;
        }

        if (this.newEmployee.mobileNumber === undefined || this.newEmployee.mobileNumber === '') {
            this.newEmployee.mobileNumber = null;
            alert('Mobile number is required');
            return;
        } else {
            let selectedEmployee = null;
            this.employeeList.forEach(employee => {
                if (employee.mobileNumber === this.newEmployee.mobileNumber) {
                    selectedEmployee = employee;
                }
            });
            if (selectedEmployee) {
                alert('Mobile Number already exists in '+selectedEmployee.name+'\'s profile');
                return;
            }
        }

        this.newEmployee.parentSchool = this.user.activeSchool.dbId;

        this.isLoading = true;

        this.employeeService.createEmployeeProfile(this.newEmployee, this.user.jwt).then(response => {
                let post_data = {
                    parentEmployee: response.id,
                    parentSession: this.user.activeSchool.currentSessionDbId,
                    paidLeaveNumber: this.newEmployeeSessionDetail.paidLeaveNumber,
                };
                this.employeeService.createEmployeeSessionDetail(post_data, this.user.jwt).then(response => {
                    this.isLoading = false;
                    alert('Employee Profile Created Successfully');
                    this.newEmployee = {};
                    this.newEmployeeSessionDetail = {};
                });
            }, error => {
                this.isLoading = false;
                alert('Server Error: Contact admin');
            }
        );
    }

}
