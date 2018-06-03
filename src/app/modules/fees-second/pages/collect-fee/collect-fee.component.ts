import { Component, Input } from '@angular/core';
import {style, state, trigger, animate, transition} from "@angular/animations";


import { FeeService } from '../../fee.service';

import { FeeReceipt } from '../../classes/common-functionalities';

import { EmitterService } from '../../../../services/emitter.service';
import {FREQUENCY_LIST} from '../../classes/constants';

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
    selector: 'app-collect-fee',
    templateUrl: './collect-fee.component.html',
    styleUrls: ['./collect-fee.component.css'],
    providers: [ FeeService ],
    animations: [
        trigger('rotate', [
            state('true', style({transform: 'rotate(0deg)'})),
            state('false', style({transform: 'rotate(180deg)'})),
            transition('true => false', animate('800ms linear')),
            transition('false => true', animate('800ms linear'))
        ]),
        trigger('slideDown', [
            state('true', style({height: '*'})),
            state('false', style({height: 0, overflow: 'hidden'})),
            transition('true => false', animate('800ms linear')),
            transition('false => true', animate('800ms linear'))
        ])
    ],
})

export class CollectFeeComponent {

    @Input() user;

    selectedStudent: any;

    studentFeeProfile: any;

    studentFeeStatusList: any;

    showDetails: boolean;

    showPreviousFeeDetails: boolean;

    feeReceiptList: any;

    remark: string;

    isLoading = false;

    frequencyList = FREQUENCY_LIST;

    constructor (private feeService: FeeService) { }

    getStudentFeeDetails(student: any): void {
        const data = {
            studentDbId: student.dbId,
        };
        this.selectedStudent = student;
        this.getStudentFeeProfile(data);
        this.getStudentFeeReceiptList(data);
    }

    getStudentFeeReceiptList(data): void {
        this.feeReceiptList = null;
        this.feeService.getStudentFeeReceiptList(data, this.user.jwt).then(feeReceiptList => {
            if (this.selectedStudent.dbId === data['studentDbId']) {
                this.feeReceiptList = feeReceiptList;
                console.log(this.feeReceiptList);
            }
        });
    }

    getStudentFeeProfile(data: any): void {
        this.isLoading = true;
        this.studentFeeStatusList = null;
        data['sessionDbId'] = this.user.activeSchool.currentSessionDbId;
        this.feeService.getStudentFeeProfile(data, this.user.jwt).then( studentFeeProfile => {
            this.isLoading = false;
            if (this.selectedStudent.dbId === data['studentDbId']) {
                this.studentFeeProfile = studentFeeProfile;
                this.studentFeeStatusList = studentFeeProfile['sessionFeeStatusList'];
                this.studentFeeStatusList.forEach(sessionFeeStatus => {
                    sessionFeeStatus.componentList.forEach( component => {
                        component.showDetails = false;
                        if (component.frequency === FREQUENCY_LIST[0]) {
                            component.payment = 0;
                        } else if ( component.frequency === FREQUENCY_LIST[1]) {
                            component.monthList.forEach( componentMonthly => {
                                componentMonthly.payment = 0;
                            });
                        }
                    });
                });
                this.showDetails = true;
                this.showPreviousFeeDetails = false;
                console.log(this.studentFeeStatusList);
            }
        }, error => {
            this.isLoading = false;
            alert('error');
        });
    }

    generateFeeReceipt(): void {

        let data = {
            studentDbId: this.selectedStudent.dbId,
            remark: (this.remark)?this.remark:null,
            parentReceiver: this.user.id,
        };

        data['subFeeReceiptList'] = [];

        this.studentFeeStatusList.forEach(sessionFeeStatus => {
            sessionFeeStatus.componentList.forEach( component => {
                if (this.getComponentPayment(component)) {
                    let subReceipt = {
                        componentDbId: component.dbId,
                        frequency: component.frequency,
                    };
                    if (component.frequency === FREQUENCY_LIST[0]) {
                        subReceipt['amount'] = this.getComponentPayment(component);
                    }
                    else if (component.frequency === FREQUENCY_LIST[1]) {
                        subReceipt['monthList'] = [];
                        component.monthList.forEach( componentMonthly => {
                            let subReceiptMonthly = {
                                month: componentMonthly.month,
                                amount: this.getComponentMonthlyPayment(componentMonthly),
                            };
                            subReceipt['monthList'].push(subReceiptMonthly);
                        });
                    }
                    data['subFeeReceiptList'].push(subReceipt);
                }
            });
        });

        console.log(data);

        this.isLoading = true;
        this.remark = null;
        this.feeService.createFeeReceipt(data, this.user.jwt).then( response => {
            this.isLoading = false;
            alert(response['message']);

            this.studentFeeStatusList = response['studentFeeStatusList'];
            this.studentFeeStatusList.forEach(sessionFeeStatus => {
                sessionFeeStatus.componentList.forEach( component => {
                    component.showDetails = false;
                    if (component.frequency === FREQUENCY_LIST[0]) {
                        component.payment = 0;
                    } else if ( component.frequency === FREQUENCY_LIST[1]) {
                        component.monthList.forEach( componentMonthly => {
                            componentMonthly.payment = 0;
                        });
                    }
                });
            });
            this.studentFeeStatusList.showDetails = false;

            this.printFeeReceipt(response['feeReceipt']);

            this.feeReceiptList.unshift(response['feeReceipt']);

        }, error => {
            this.isLoading = false;
        });

    }

    printFeeReceipt(feeReceipt: any): void {
        console.log(feeReceipt);
        EmitterService.get('print-new-fee-receipt').emit(feeReceipt);
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
    toggleStudentFeeDetails(): void {
        if (this.studentFeeStatusList.showDetails) {
            this.studentFeeStatusList.showDetails = false;
        } else {
            this.studentFeeStatusList.showDetails = true;
        }
    }

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
    toggleComponentFeeDetails(component: any): void {
        component.showDetails = !component.showDetails;
    }

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
