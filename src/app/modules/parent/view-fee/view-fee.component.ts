import { Component, Input, OnInit, OnChanges } from '@angular/core';
import {style, state, trigger, animate, transition} from "@angular/animations";


import { FeeOldService } from '../../fees-second/fee-old.service';

import { FeeReceipt } from '../../fees-second/classes/common-functionalities';

import { Concession } from '../../fees-second/classes/common-functionalities';

/*import { EmitterService } from '../../../../services/emitter.service';
import { FREQUENCY_LIST } from '../../classes/constants';*/

import { FREQUENCY_LIST } from '../../fees-second/classes/constants';

const APRIL = 'APRIL';
const MAY = 'MAY';
const JUNE = 'JUNE';
const JULY = 'JULY';
const AUGUST = 'AUGUST';
const SEPTEMBER = 'SEPTEMBER';
const OCTOBER = 'OCTOBER';
const NOVEMBER = 'NOVEMBER';
const DECEMBER = 'DECEMBER';
const JANUARY = 'JANUARY';
const FEBRUARY = 'FEBRUARY';
const MARCH = 'MARCH';


@Component({
    selector: 'view-fee',
    templateUrl: './view-fee.component.html',
    styleUrls: ['./view-fee.component.css'],
    providers: [ FeeOldService ],
})

export class ViewFeeComponent implements OnInit, OnChanges {

    @Input() user;

    @Input() studentId;

    studentFeeProfile: any;

    studentFeeStatusList: any;

    showPreviousFeeDetails: boolean;

    showPreviousConcessionDetails: boolean;

    feeReceiptList: any;

    concessionList: any;

    remark: string;

    isLoading = false;

    frequencyList = FREQUENCY_LIST;

    constructor (private feeService: FeeOldService) { }

    ngOnChanges(): void {
        this.ngOnInit();
    }

    initializeData(): void {
        this.studentFeeProfile = null;
        this.studentFeeStatusList = null;
        this.showPreviousFeeDetails = null;
        this.showPreviousConcessionDetails = null;
        this.feeReceiptList = null;
        this.concessionList = null;
        this.remark = null;
        this.isLoading = false;
        this.frequencyList = FREQUENCY_LIST;
    }

    ngOnInit(): void {
        this.initializeData();
        const data = {
            studentDbId: this.user.section.student.id,
        };
        // this.selectedStudent = this.user.activeSchool.section.student;
        this.getStudentFeeProfile(data);
        this.getStudentFeeReceiptList(data);
        this.getStudentConcessionList(data);
    }

    /*getStudentFeeDetails(student: any): void {
        const data = {
            studentDbId: student.dbId,
        };
        this.selectedStudent = student;
        this.getStudentFeeProfile(data);
        this.getStudentFeeReceiptList(data);
    }*/

    getStudentConcessionList(data): void {
        this.concessionList = null;
        this.feeService.getStudentConcessionList(data, this.user.jwt).then(concessionList => {
            this.concessionList = concessionList;
            console.log(this.concessionList);
        });
    }

    getStudentFeeReceiptList(data): void {
        this.feeReceiptList = null;
        this.feeService.getStudentFeeReceiptList(data, this.user.jwt).then(feeReceiptList => {
            this.feeReceiptList = feeReceiptList;
            console.log(this.feeReceiptList);
        });
    }

    getStudentFeeProfile(data: any): void {
        this.isLoading = true;
        this.studentFeeStatusList = null;
        data['sessionDbId'] = this.user.activeSchool.currentSessionDbId;
        this.feeService.getStudentFeeProfile(data, this.user.jwt).then( studentFeeProfile => {
            this.isLoading = false;
            this.studentFeeProfile = studentFeeProfile;
            this.studentFeeStatusList = studentFeeProfile['sessionFeeStatusList'];
            this.studentFeeStatusList.forEach(sessionFeeStatus => {
                sessionFeeStatus.componentList.forEach( component => {
                    if (component.frequency === FREQUENCY_LIST[0]) {
                        component.payment = 0;
                    } else if ( component.frequency === FREQUENCY_LIST[1]) {
                        component.monthList.forEach( componentMonthly => {
                            componentMonthly.payment = 0;
                        });
                    }
                });
            });
            this.showPreviousFeeDetails = false;
            this.showPreviousConcessionDetails = false;
            console.log(this.studentFeeStatusList);
        }, error => {
            this.isLoading = false;
            alert('error');
        });
    }

    getConcessionListTotalAmount(): number {
        return Concession.getConcessionListTotalAmount(this.concessionList);
    }

    showSessionFeesLine(): boolean {
        let number = 0;
        this.studentFeeStatusList.forEach(sessionFeeStatus => {
            if (this.getSessionFeesDue(sessionFeeStatus) > 0) {
                number += 1;
            }
        });
        return number > 1;
    }

    getFeeReceiptTotalAmount(feeReceipt: any): number {
        return FeeReceipt.getFeeReceiptTotalAmount(feeReceipt);
    }

    // Student Payment & Fee

    handleStudentPaymentChange(payment: number): void {
        if (payment === null) payment = 0;
        let amountLeft = payment;
        this.studentFeeStatusList.forEach(sessionFeeStatus => {
            let amountDue = this.getSessionFeesDue(sessionFeeStatus);
            if(amountDue > amountLeft) {
                this.handleSessionPaymentChange(sessionFeeStatus, amountLeft);
                amountLeft = 0;
            } else {
                this.handleSessionPaymentChange(sessionFeeStatus, amountDue);
                amountLeft -= amountDue;
            }
        });
    }

    getStudentPayment(): number {
        let payment = 0;
        this.studentFeeStatusList.forEach(sessionFeeStatus => {
            payment += this.getSessionPayment(sessionFeeStatus);
        });
        return payment;
    }

    getStudentTotalFee(): number {
        let amount = 0;
        this.studentFeeStatusList.forEach(sessionFeeStatus => {
            if (this.getSessionFeesDue(sessionFeeStatus) > 0) {
                amount += this.getSessionTotalFee(sessionFeeStatus);
            }
        });
        return amount;
    }

    getStudentFeesDue(): number {
        let amountDue = 0;
        this.studentFeeStatusList.forEach(sessionFeeStatus => {
            amountDue += this.getSessionFeesDue(sessionFeeStatus);
        });
        return amountDue;
    }

    policeStudentPaymentInput(event: any): boolean {
        if (event.key !== '0' && event.key !== '1' && event.key !== '2' && event.key !== '3' &&
            event.key !== '4' && event.key !== '5' && event.key !== '6' && event.key !== '7' &&
            event.key !== '8' && event.key !== '9') {
            return false;
        }
        let studentFeesDue = this.getStudentFeesDue();
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > studentFeesDue) {
            event.srcElement.value = studentFeesDue;
            this.handleStudentPaymentChange(Number(event.srcElement.value));
            return false;
        }
        return true;
    }


    // Session Payment & Fee
    handleSessionPaymentChange(sessionFeeStatus: any, payment: number): void {
        if (payment === null) payment = 0;
        let amountLeft = payment;

        // handle Annual Components
        sessionFeeStatus.componentList.forEach(component => {
            if (component.frequency === FREQUENCY_LIST[0]) {
                let amountDue = this.getComponentFeesDue(component);
                if(amountDue > amountLeft) {
                    this.handleComponentPaymentChange(component, amountLeft);
                    amountLeft = 0;
                } else {
                    amountLeft -= amountDue;
                    this.handleComponentPaymentChange(component, amountDue);
                }
            }
        });

        // handle Monthly Components
        for (let i=0; i<12; ++i) {
            sessionFeeStatus.componentList.forEach(component => {
                if (component.frequency === FREQUENCY_LIST[1]) {
                    let amountDue = component.monthList[i].amountDue;
                    if (amountDue > amountLeft) {
                        component.monthList[i].payment = amountLeft;
                        amountLeft = 0;
                    } else {
                        component.monthList[i].payment = amountDue;
                        amountLeft -= amountDue;
                    }
                }
            });
        }
    }

    getSessionPayment(sessionFeeStatus: any): number {
        let payment = 0;
        sessionFeeStatus.componentList.forEach(component => {
            payment += this.getComponentPayment(component);
        });
        return payment;
    }

    getSessionTotalFee(sessionFeeStatus: any): number {
        let amount = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amount += this.getComponentTotalFee(component);
        });
        return amount;
    }

    getSessionFeesDue(sessionFeeStatus: any): number {
        let amountDue = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amountDue += this.getComponentFeesDue(component);
        });
        return amountDue;
    }

    policeSessionPaymentInput(sessionFeeStatus: any, event: any): boolean {
        if (event.key !== '0' && event.key !== '1' && event.key !== '2' && event.key !== '3' &&
            event.key !== '4' && event.key !== '5' && event.key !== '6' && event.key !== '7' &&
            event.key !== '8' && event.key !== '9') {
            return false;
        }
        let sessionFeesDue = this.getSessionFeesDue(sessionFeeStatus);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > sessionFeesDue) {
            event.srcElement.value = sessionFeesDue;
            this.handleSessionPaymentChange(sessionFeeStatus, Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    // Component Payment & Fee

    handleComponentPaymentChange(component: any, payment: number): void {
        if (payment === null) payment = 0;
        let amountLeft = payment;
        if (component.frequency === FREQUENCY_LIST[0]) {
            component.payment = payment;
        } else if (component.frequency === FREQUENCY_LIST[1]) {
            component.monthList.forEach(componentMonthly => {
                let amountDue = componentMonthly.amountDue;
                if (amountDue > amountLeft) {
                    componentMonthly.payment = amountLeft;
                    amountLeft = 0;
                } else {
                    componentMonthly.payment = amountDue;
                    amountLeft -= amountDue;
                }
            });
        }
    }

    getComponentPayment(component: any): number {
        let payment = 0;
        if (component.frequency === FREQUENCY_LIST[0]) {
            payment = component.payment;
        } else if (component.frequency === FREQUENCY_LIST[1]) {
            component.monthList.forEach( componentMonthly => {
                // payment += componentMonthly.payment;
                payment += this.getComponentMonthlyPayment(componentMonthly);
            });
        }
        return payment;
    }

    getComponentTotalFee(component: any): number {
        let amount = 0;
        if (component.frequency === FREQUENCY_LIST[0]) {
            amount += component.amount;
        } else if (component.frequency === FREQUENCY_LIST[1]) {
            component.monthList.forEach( componentMonthly => {
                // amount += componentMonthly.amount;
                amount += this.getComponentMonthlyTotalFee(componentMonthly);
            });
        }
        return amount;
    }

    getComponentFeesDue(component: any): number {
        let amountDue = 0;
        if (component.frequency === FREQUENCY_LIST[0]) {
            amountDue += component.amountDue;
        } else if (component.frequency === FREQUENCY_LIST[1]) {
            component.monthList.forEach( componentMonthly => {
                // amountDue += componentMonthly.amountDue;
                amountDue += this.getComponentMonthlyFeesDue(componentMonthly);
            });
        }
        return amountDue;
    }

    policeComponentPaymentInput(component: any, event: any): boolean {
        if (event.key !== '0' && event.key !== '1' && event.key !== '2' && event.key !== '3' &&
            event.key !== '4' && event.key !== '5' && event.key !== '6' && event.key !== '7' &&
            event.key !== '8' && event.key !== '9') {
            return false;
        }
        let componentFeesDue = this.getComponentFeesDue(component);
        let payment = Number(event.srcElement.value+''+event.key);
        if (payment > componentFeesDue) {
            event.srcElement.value = componentFeesDue;
            this.handleComponentPaymentChange(component, Number(event.srcElement.value));
            return false;
        }
        return true;
    }


    // Component Monthly Fee
    getComponentMonthlyPayment(componentMonthly: any): number {
        return componentMonthly.payment;
    }

    getComponentMonthlyTotalFee(componentMonthly: any): number {
        return componentMonthly.amount;
    }

    getComponentMonthlyFeesDue(componentMonthly: any): number {
        return componentMonthly.amountDue;
    }


}
