import { Component, OnInit, Input, OnDestroy, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import {EmitterService} from "../../../../services/emitter.service";
import {INSTALLMENT_LIST} from "../../classes/constants";
import {SESSION_LIST} from "../../../../classes/constants/session";

@Component({
    selector: 'app-print-full-fee-receipt-list',
    templateUrl: './print-full-fee-receipt-list.component.html',
    styleUrls: ['./print-full-fee-receipt-list.component.css'],
})

export class PrintFullFeeReceiptListComponent implements OnInit, OnDestroy, AfterViewChecked {

    installmentList = INSTALLMENT_LIST;
    sessionList = SESSION_LIST;

    @Input() user;

    feeTypeList: any;
    feeReceiptList: any;
    subFeeReceiptList: any;
    studentList: any;
    studentSectionList: any;
    classList: any;
    sectionList: any;
    employeeList: any;

    printFullFeeReceiptListComponentSubscription: any;

    checkView = false;

    constructor(private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        // this.feeReceipt = new TempFee();
        this.printFullFeeReceiptListComponentSubscription =
            EmitterService.get('print-full-fee-receipt-list-component').subscribe(value => {

                console.log(value);

                this.feeTypeList = value['feeTypeList'];
                this.feeReceiptList = value['feeReceiptList'];
                this.subFeeReceiptList = value['subFeeReceiptList'];
                this.studentList = value['studentList'];
                this.studentSectionList = value['studentSectionList'];
                this.classList = value['classList'];
                this.sectionList = value['sectionList'];
                this.employeeList = value['employeeList'];

                this.checkView = true;
        });
    }

    ngAfterViewChecked(): void {
        if(this.checkView) {
            this.checkView = false;
            window.print();
            this.feeReceiptList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printFullFeeReceiptListComponentSubscription.unsubscribe();
    }

    getStudent(studentId: number): any {
        return this.studentList.find(student => {
            return student.id == studentId;
        });
    }

    getClassName(feeReceipt: any): any {
        return this.classList.find(classs => {
            return classs.dbId == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == feeReceipt.parentStudent
                    && studentSection.parentSession == feeReceipt.parentSession;
            }).parentClass;
        }).name;
    }

    getSectionName(feeReceipt: any): any {
        return this.sectionList.find(section => {
            return section.id == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == feeReceipt.parentStudent
                    && studentSection.parentSession == feeReceipt.parentSession;
            }).parentDivision;
        }).name;
    }

    getFeeTypeName(subFeeReceipt: any): any {
        return this.feeTypeList.find(feeType => {
            return subFeeReceipt.parentFeeType == feeType.id;
        }).name;
    }

    getSessionName(sessionId: any): any {
        return this.sessionList.find(session => {
            return sessionId == session.id;
        }).name;
    }

    getEmployeeName(employeeId: any): any {
        let employee = this.employeeList.find(employee => {
            return employeeId == employee.id;
        });
        return employee?employee.name:'';
    }

    getSubFeeReceiptList(feeReceipt: any): any {
        return this.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
        });
    }

    getTotalFeeReceiptAmount(feeReceipt: any): number {
        return this.getSubFeeReceiptList(feeReceipt).reduce((subFeeReceiptTotal, subFeeReceipt) => {
            return subFeeReceiptTotal + this.installmentList.reduce((installmentTotal, installment) => {
                return installmentTotal
                    + (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0)
                    + (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0);
            }, 0);
        },0);
    }

    getNumberOfRows(feeReceipt: any): number {
        let numberOfRows = 0;
        this.getSubFeeReceiptList(feeReceipt).forEach(subFeeReceipt => {
            if((subFeeReceipt.isAnnually && subFeeReceipt['aprilAmount'] > 0) || !subFeeReceipt.isAnnually) {
                ++numberOfRows;
            }
            if((subFeeReceipt.isAnnually && subFeeReceipt['aprilLateFee'] > 0)) {
                ++numberOfRows;
            }
            if (!subFeeReceipt.isAnnually) {
                this.installmentList.forEach(installment => {
                    if (subFeeReceipt[installment+'Amount'] && subFeeReceipt[installment+'Amount'] > 0) {
                        ++numberOfRows;
                    }
                    if (subFeeReceipt[installment+'LateFee'] && subFeeReceipt[installment+'LateFee'] > 0) {
                        ++numberOfRows;
                    }
                });
            }
        });
        return numberOfRows;
    }

    /*getMonthRange(subFeeReceipt: any): string {
        if (subFeeReceipt.frequency === FREQUENCY_LIST[0]) {
            return '';
        } else if (subFeeReceipt.frequency === FREQUENCY_LIST[1]) {
            let startingMonth = '', endingMonth = '';
            subFeeReceipt['monthList'].forEach( month => {
                if (month.amount > 0) {
                    if (startingMonth === '') {
                        startingMonth = month['month'];
                        endingMonth = month['month'];
                    } else {
                        endingMonth = month['month'];
                    }
                }
            });
            if (startingMonth === endingMonth) {
                return this.getMonthAbbreviation(startingMonth);
            } else {
                return this.getMonthAbbreviation(startingMonth) + ' - ' + this.getMonthAbbreviation(endingMonth);
            }
        }
    }

    getMonthAbbreviation(monthName: string): string {
        if (monthName.length === 3) {
            return monthName;
        } else {
            return monthName.substr(0,3) + '.';
        }
    }*/

}
