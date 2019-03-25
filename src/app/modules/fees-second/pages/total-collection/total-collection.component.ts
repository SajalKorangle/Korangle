import { Component, Input, OnInit } from '@angular/core';

import { FeeService } from '../../fee.service';

import { FeeReceipt } from '../../classes/common-functionalities';

import {EmployeeService} from '../../../employee/employee.service';
import {EmitterService} from '../../../../services/emitter.service';

@Component({
  selector: 'app-total-collection',
  templateUrl: './total-collection.component.html',
  styleUrls: ['./total-collection.component.css'],
    providers: [FeeService, EmployeeService]
})
export class TotalCollectionComponent implements OnInit {

    @Input() user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();

    // feesList = [];

    feeReceiptList: any;
    filteredFeeReceiptList: any;

    selectedEmployee: any;
    employeeList = [];

    selectedFeeType: any;
    feeTypeList = [];

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
        this.feeService.getFeeTypeList(this.user.jwt).then(feeTypeList => {
            this.feeTypeList = feeTypeList;
            let feeType = {
                dbId: 0,
                name: 'All',
            };
            this.feeTypeList.push(feeType);
            this.selectedFeeType = feeType;
        });
    }

    getSchoolFeeReceiptList(): void {
        const data = {
            startDate: this.startDate,
            endDate: this.endDate,
            schoolDbId: this.user.activeSchool.dbId,
        };
        this.isLoading = true;
        this.feeReceiptList = null;
        this.feeService.getSchoolFeeReceiptList(data, this.user.jwt).then(feeReceiptList => {
            this.isLoading = false;
            this.feeReceiptList = feeReceiptList;
            this.populateFilteredFeeReceiptList();
        }, error => {
            this.isLoading = false;
        });
    }

    populateFilteredFeeReceiptList(): void {

        if (!this.feeReceiptList) {
            return;
        }

        if (!this.selectedEmployee || this.selectedEmployee.mobileNumber === 'All') {
            this.filteredFeeReceiptList = this.feeReceiptList;
            return;
        }

        this.filteredFeeReceiptList = this.feeReceiptList.filter(feeReceipt => {
            if (feeReceipt.parentEmployee === this.selectedEmployee.id) {
                return true;
            } else {
                return false;
            }
        });

    }

    getSchoolFeeTotalAmount(): number {
        let amount = 0;
        this.filteredFeeReceiptList.forEach( feeReceipt => {
            amount += FeeReceipt.getFeeReceiptTotalAmount(feeReceipt, this.selectedFeeType.name);
        });
        return amount;
    }

    /*printFeeRecords(): void {
        const emitValue = [];
        emitValue['feesList'] = this.feesList;
        emitValue['startDate'] = this.startDate;
        emitValue['endDate'] = this.endDate;
        emitValue['totalFees'] = this.totalFees;
        EmitterService.get('print-fee-records').emit(emitValue);
    }*/

    printFeeReceiptList(): void {
        let value = {
            'feeReceiptList': this.filteredFeeReceiptList,
            'feeType': this.selectedFeeType,
            'employee': this.selectedEmployee,
        };
        EmitterService.get('print-fee-receipt-list').emit(value);
    }

}
