import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { INSTALLMENT_LIST } from '../../classes/constants';
import { PrintService } from '../../../../print/print-service';
import { DueAmountService } from '../../../../services/dueAmount'

@Component({
    templateUrl: './print-full-fee-receipt-list.component.html',
    styleUrls: ['./print-full-fee-receipt-list.component.css'],
})
export class PrintFullFeeReceiptListComponent implements OnInit, AfterViewChecked {
    installmentList = INSTALLMENT_LIST;
    sessionList = [];

    user: any;
    overallFeesDue: number;
    feeTypeList: any;
    feeReceiptList: any;
    subFeeReceiptList: any;
    studentList: any;
    studentSectionList: any;
    classList: any;
    sectionList: any;
    employeeList: any;
    boardList: any;
    feeReceiptBookList: any;

    checkView = false;

    // this variable is used to determine whether to print single receipt or double receipt.
    printSingleReceipt = false;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService, private dueAmount: DueAmountService) { }

    ngOnInit(): void {
        // this.feeReceipt = new TempFee();
        const { user, value } = this.printService.getData();
        this.user = user;
        this.feeTypeList = value['feeTypeList'];
        this.feeReceiptList = value['feeReceiptList'];
        this.subFeeReceiptList = value['subFeeReceiptList'];
        this.studentList = value['studentList'];
        this.studentSectionList = value['studentSectionList'];
        this.classList = value['classList'];
        this.sectionList = value['sectionList'];
        this.employeeList = value['employeeList'];
        this.boardList = value['boardList'];
        this.sessionList = value['sessionList'];
        this.checkView = true;
        this.feeReceiptBookList = value['feeReceiptBookList'];
        this.printSingleReceipt = value['printSingleReceipt'];
    }

    ngAfterViewChecked(): void {
        if (this.checkView) {
            this.checkView = false;
            this.printService.print();
            this.feeReceiptList = null;
            this.cdRef.detectChanges();
        }
    }

    getStudent(studentId: number): any {
        return this.studentList.find((student) => {
            return student.id == studentId;
        });
    }

    getClassName(feeReceipt: any): any {
        return this.classList.find((classs) => {
            return (
                classs.id ==
                this.studentSectionList.find((studentSection) => {
                    return (
                        studentSection.parentStudent == feeReceipt.parentStudent && studentSection.parentSession == feeReceipt.parentSession
                    );
                }).parentClass
            );
        }).name;
    }

    getSectionName(feeReceipt: any): any {
        return this.sectionList.find((section) => {
            return (
                section.id ==
                this.studentSectionList.find((studentSection) => {
                    return (
                        studentSection.parentStudent == feeReceipt.parentStudent && studentSection.parentSession == feeReceipt.parentSession
                    );
                }).parentDivision
            );
        }).name;
    }

    getFeeType(subFeeReceipt: any): any {
        return this.feeTypeList.find((feeType) => {
            return subFeeReceipt.parentFeeType == feeType.id;
        });
    }

    getSessionName(sessionId: any): any {
        return this.sessionList.find((session) => {
            return sessionId == session.id;
        }).name;
    }

    getEmployeeName(employeeId: any): any {
        let employee = this.employeeList.find((employee) => {
            return employeeId == employee.id;
        });
        return employee ? employee.name : '';
    }

    getSubFeeReceiptList(feeReceipt: any): any {
        return this.subFeeReceiptList
            .filter((subFeeReceipt) => {
                return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
            })
            .sort((a, b) => {
                return this.getFeeType(a).orderNumber - this.getFeeType(b).orderNumber;
            });
    }

    getTotalFeeReceiptAmount(feeReceipt: any): number {
        return this.getSubFeeReceiptList(feeReceipt).reduce((subFeeReceiptTotal, subFeeReceipt) => {
            return (
                subFeeReceiptTotal +
                this.installmentList.reduce((installmentTotal, installment) => {
                    return (
                        installmentTotal +
                        (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0) +
                        (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0)
                    );
                }, 0)
            );
        }, 0);
    }

    getNumberOfRows(feeReceipt: any): number {
        let numberOfRows = 0;
        this.getSubFeeReceiptList(feeReceipt).forEach((subFeeReceipt) => {
            if ((subFeeReceipt.isAnnually && subFeeReceipt['aprilAmount'] > 0) || !subFeeReceipt.isAnnually) {
                ++numberOfRows;
            }
            if (subFeeReceipt.isAnnually && subFeeReceipt['aprilLateFee'] > 0) {
                ++numberOfRows;
            }
            if (!subFeeReceipt.isAnnually) {
                this.installmentList.forEach((installment) => {
                    if (subFeeReceipt[installment + 'Amount'] && subFeeReceipt[installment + 'Amount'] > 0) {
                        ++numberOfRows;
                    }
                    if (subFeeReceipt[installment + 'LateFee'] && subFeeReceipt[installment + 'LateFee'] > 0) {
                        ++numberOfRows;
                    }
                });
            }
        });
        return numberOfRows;
    }

    getFeeReceiptNo(feeReceipt: any): any {
        return this.feeReceiptBookList.find(feeReceiptBook => {
            return feeReceiptBook.id == feeReceipt.parentFeeReceiptBook;
        }).receiptNumberPrefix + feeReceipt.receiptNumber;
    }

    shouldShowDueAmount(): boolean {
        return this.dueAmount.showDueAmount;
    }

    getOverAllDue():number{
        return this.dueAmount.overAllDueAmount;
    }


}
