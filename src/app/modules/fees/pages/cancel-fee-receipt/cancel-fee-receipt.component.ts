import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { CancelFeeReceiptServiceAdapter } from "./cancel-fee-receipt.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {ClassOldService} from "../../../../services/modules/class/class-old.service";
import {ClassService} from "../../../../services/modules/class/class.service";
import {StudentService} from "../../../../services/modules/student/student.service";
import {FormControl} from "@angular/forms";
import {INSTALLMENT_LIST, MODE_OF_PAYMENT_LIST} from "../../classes/constants";
import {EmployeeService} from "../../../../services/modules/employee/employee.service";
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'cancel-fee-receipt',
    templateUrl: './cancel-fee-receipt.component.html',
    styleUrls: ['./cancel-fee-receipt.component.css'],
    providers: [ FeeService, ClassOldService, ClassService, StudentService, EmployeeService ],
})

export class CancelFeeReceiptComponent implements OnInit {

    installmentList = INSTALLMENT_LIST;
    modeOfPaymentList = MODE_OF_PAYMENT_LIST;

     user;

    searchParameter = new FormControl();

    feeReceiptList: any;
    subFeeReceiptList = [];
    studentList = [];
    studentSectionList = [];
    classList = [];
    sectionList = [];
    employeeList = [];

    serviceAdapter: CancelFeeReceiptServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                public classOldService: ClassOldService,
                public classService : ClassService,
                public studentService: StudentService,
                public employeeService: EmployeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new CancelFeeReceiptServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
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

    getEmployeeName(feeReceipt: any): any {
        let employee = this.employeeList.find(employee => {
            return employee.id == feeReceipt.parentEmployee;
        });
        return employee?employee.name:null;
    }

    getStudent(feeReceipt: any): any {
        return this.studentList.find(student => {
            return student.id == feeReceipt.parentStudent;
        });
    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return this.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
        }).reduce((total, subFeeReceipt) => {
            return total + this.installmentList.reduce((amount, installment) => {
                return amount
                    + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                    + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
            }, 0);
        }, 0);
    }

}
