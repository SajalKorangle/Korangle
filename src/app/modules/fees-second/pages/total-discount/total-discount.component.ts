import { Component, Input, OnInit } from '@angular/core';

import { FeeService } from '../../fee.service';

import { Concession } from '../../classes/common-functionalities';
import {EmployeeService} from '../../../employee/employee.service';

@Component({
  selector: 'app-total-discount',
  templateUrl: './total-discount.component.html',
  styleUrls: ['./total-discount.component.css'],
    providers: [FeeService, EmployeeService]
})
export class TotalDiscountComponent implements OnInit {

    @Input() user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();

    concessionList: any;
    filteredConcessionList: any;

    selectedEmployee: any;
    employeeList = [];

    isLoading = false;

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return year + '-' + month + '-' + day;
    }

    constructor(private feeService: FeeService,
                private employeeService: EmployeeService) { }

    ngOnInit(): void {
        let data = {
            parentSchool: this.user.activeSchool.dbId,
        };
        this.employeeService.getEmployeeMiniProfileList(data, this.user.jwt).then(employeeList => {
            this.employeeList = employeeList;
            let employee = {
                id: 0,
                name: 'All',
                mobileNumber: 'All',
                employeeNumber: null,
            };
            this.employeeList.push(employee);
            this.selectedEmployee = employee;
        });
    }

    getSchoolConcessionList(): void {
        const data = {
            startDate: this.startDate,
            endDate: this.endDate,
            schoolDbId: this.user.activeSchool.dbId,
        };
        this.isLoading = true;
        this.concessionList = null;
        this.feeService.getSchoolConcessionList(data, this.user.jwt).then(concessionList => {
            this.isLoading = false;
            this.concessionList = concessionList;
            this.populateFilteredConcessionList();
            console.log(this.concessionList);
        }, error => {
            this.isLoading = false;
        });
    }

    populateFilteredConcessionList(): void {

        if (!this.concessionList) {
            return;
        }

        if (!this.selectedEmployee || this.selectedEmployee.mobileNumber === 'All') {
            this.filteredConcessionList = this.concessionList;
            return;
        }

        this.filteredConcessionList = this.concessionList.filter(concession => {
            if (concession.parentEmployee === this.selectedEmployee.id) {
                return true;
            } else {
                return false;
            }
        });

    }

    getSchoolConcessionListTotalAmount(): number {
        return Concession.getConcessionListTotalAmount(this.concessionList);
    }

}
