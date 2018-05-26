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

    isLoading = false;

    constructor (private employeeService: EmployeeService) { }

    ngOnInit(): void {
        this.newEmployee = {};
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

        this.newEmployee.parentSchool = this.user.activeSchool.dbId;

        this.isLoading = true;

        this.employeeService.createEmployeeProfile(this.newEmployee, this.user.jwt).then(message => {
                this.isLoading = false;
                alert(message);
                this.newEmployee = {};
            }, error => {
                this.isLoading = false;
                alert('Server Error: Contact admin');
            }
        );
    }

}
