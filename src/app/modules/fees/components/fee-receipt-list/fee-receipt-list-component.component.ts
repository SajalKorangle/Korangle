import { Component, Input } from '@angular/core';
import {INSTALLMENT_LIST} from "../../classes/constants";
import {SESSION_LIST} from "../../../../classes/constants/session";
import {EmitterService} from "../../../../services/emitter.service";

// import {EmitterService} from '../../services/emitter.service';
// import {FeeReceipt} from '../../modules/fees-second/classes/common-functionalities';

@Component({
    selector: 'app-fee-receipt-list',
    templateUrl: './fee-receipt-list-component.component.html',
    styleUrls: ['./fee-receipt-list-component.component.css'],
})
export class FeeReceiptListComponent {

    @Input() user;
    @Input() feeTypeList;
    @Input() feeReceiptList;
    @Input() subFeeReceiptList;
    @Input() studentList;
    @Input() studentSectionList;
    @Input() classList;
    @Input() sectionList;
    @Input() employeeList;
    @Input() receiptColumnFilter;
    @Input() number = 3;

    // Constant Lists
    installmentList = INSTALLMENT_LIST;
    sessionList = SESSION_LIST;

    // @Input() whileSubmittingFee;
    /*@Input() feeType = {
        dbId: 0,
        name: 'All',
    };
    @Input() sectionName;*/

    printFeeReceipt(feeReceipt: any): void {

        let data = {
            'feeTypeList': this.feeTypeList,
            'feeReceiptList': [feeReceipt],
            'subFeeReceiptList': this.subFeeReceiptList.filter(item => { return item.parentFeeReceipt == feeReceipt.id }),
            'studentList': this.studentList,
            'studentSectionList': this.studentSectionList,
            'classList': this.classList,
            'sectionList': this.sectionList,
            'employeeList': this.employeeList,
        };

        EmitterService.get('print-full-fee-receipt-list').emit(data);

    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return this.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
        }).reduce((totalSubFeeReceipt, subFeeReceipt) => {
            return totalSubFeeReceipt + this.installmentList.reduce((totalInstallment, installment) => {
                return totalInstallment
                    + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                    + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
            }, 0);
        }, 0);
    }

    increaseNumber(): void {
        this.number += 3;
    }

    getStudentName(studentId: number): any {
        return this.studentList.find(student => {
            return student.id == studentId;
        }).name;
    }

    getStudentScholarNumber(studentId: number): any {
        return this.studentList.find(student => {
            return student.id == studentId;
        }).scholarNumber;
    }

    getClassName(studentId: any, sessionId: any): any {
        return this.classList.find(classs => {
            return classs.dbId == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
            }).parentClass;
        }).name;
    }

    getSectionName(studentId: any, sessionId: any): any {
        return this.sectionList.find(section => {
            return section.id == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == studentId && studentSection.parentSession == sessionId;
            }).parentDivision;
        }).name;
    }

    getEmployeeName(feeReceipt: any): any {
        let employee = this.employeeList.find(employee => {
            return employee.id == feeReceipt.parentEmployee;
        });
        return employee?employee.name:null;
    }

}
