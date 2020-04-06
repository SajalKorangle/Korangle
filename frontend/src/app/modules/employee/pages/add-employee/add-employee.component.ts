import {Component, Input, OnInit} from '@angular/core';

import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import {DataStorage} from "../../../../classes/data-storage";
import {BankService} from '../../../../services/bank.service';

@Component({
  selector: 'add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  providers:[BankService]
})

export class AddEmployeeComponent implements OnInit {

    user;

    newEmployee: any;
    newEmployeeSessionDetail: any;

    employeeList = [];

    isLoading = false;

    constructor (private employeeService: EmployeeOldService,
                 private bankService: BankService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.newEmployee = {};
        this.newEmployeeSessionDetail = {};
        let data = {
            parentSchool: this.user.activeSchool.dbId,
        };
        this.employeeService.getEmployeeMiniProfileList(data, this.user.jwt).then(employeeList => {
            this.employeeList = employeeList;
        });
    }

    checkLength(value: any) {
        if (value && value.toString().length > 0) {
            return true;
        }
        return false;
    }

    checkRight(value: any, rightValue: number) {
        if (value && value.toString().length === rightValue) {
            return true;
        }
        return false;
    }

    policeNumberInput(event: any): boolean {
        let value = event.key;
        if (value !== '0' && value !== '1' && value !== '2' && value !== '3' &&
            value !== '4' && value !== '5' && value !== '6' && value !== '7' &&
            value !== '8' && value !== '9') {
            return false;
        }
        return true;
    }

    getBankDetails(){
        if(this.newEmployee.bankIfscCode.length < 11){
            return ;
        }
        this.bankService.getDetailsFromIFSCCode(this.newEmployee.bankIfscCode.toString()).then(value=>{
            this.newEmployee.bankName = value ;
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

        if (this.newEmployee.dateOfJoining === undefined || this.newEmployee.dateOfJoining === '') {
            this.newEmployee.dateOfJoining = null;
        }

        if (this.newEmployee.dateOfLeaving === undefined || this.newEmployee.dateOfLeaving === '') {
            this.newEmployee.dateOfLeaving = null;
        }

        if (this.newEmployee.mobileNumber === undefined || this.newEmployee.mobileNumber === '') {
            this.newEmployee.mobileNumber = null;
            alert('Mobile number is required');
            return;
        } else if (this.newEmployee.mobileNumber.toString().length != 10){
            alert('Mobile number should be of 10 digits');
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

        if (this.newEmployee.aadharNumber != null
            && this.newEmployee.aadharNumber.toString().length != 12) {
            alert("Aadhar No. should be 12 digits");
            return;
        }

        this.newEmployee.parentSchool = this.user.activeSchool.dbId;

        this.isLoading = true;

        console.log(this.newEmployee);
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
