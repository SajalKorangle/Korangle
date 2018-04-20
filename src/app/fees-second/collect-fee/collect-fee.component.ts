import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FeeService } from '../fee.service';

@Component({
    selector: 'app-collect-fee',
    templateUrl: './collect-fee.component.html',
    styleUrls: ['./collect-fee.component.css'],
    providers: [ FeeService ],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CollectFeeComponent {

    @Input() user;

    selectedStudent: any;

    studentFeeStatus: any;

    isLoading = false;

    constructor (private feeService: FeeService,
                 private cd: ChangeDetectorRef) { }

    getStudentFeeStatus(student: any): void {
        const data = {
            studentDbId: student.dbId,
        };
        this.selectedStudent = student;
        this.isLoading = true;
        this.studentFeeStatus = null;
        this.feeService.getStudentFeeStatus(data, this.user.jwt).then( studentFeeStatus => {
            this.isLoading = false;
            if (this.selectedStudent.dbId === studentFeeStatus['studentDbId']) {
                this.studentFeeStatus = studentFeeStatus;
                this.studentFeeStatus.sessionFeeStatusList.forEach( sessionFeeStatus => {
                    sessionFeeStatus.componentList.forEach( component => {
                        if (component.frequency === 'ANNUALLY') {
                            component.payment = 0;
                        } else if ( component.frequency === 'MONTHLY') {
                            component.monthList.forEach( componentMonthly => {
                                componentMonthly.payment = 0;
                            });
                        }
                    });
                });
                // console.log(studentFeeStatus);
            }
        }, error => {
            this.isLoading = false;
            alert('error');
        });
    }

    // Student Payment & Fee
    handleStudentPaymentChange(payment: number): void {
        if (payment === null) payment = 0;
        let amountLeft = payment;
        this.studentFeeStatus.sessionFeeStatusList.forEach( sessionFeeStatus => {
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
        this.studentFeeStatus.sessionFeeStatusList.forEach(sessionFeeStatus => {
            payment += this.getSessionPayment(sessionFeeStatus);
        });
        return payment;
    }

    getStudentTotalFee(): number {
        let amount = 0;
        this.studentFeeStatus.sessionFeeStatusList.forEach(sessionFeeStatus => {
            if (this.getSessionFeesDue(sessionFeeStatus) > 0) {
                amount += this.getSessionTotalFee(sessionFeeStatus);
            }
        });
        return amount;
    }

    getStudentFeesDue(): number {
        let amountDue = 0;
        this.studentFeeStatus.sessionFeeStatusList.forEach(sessionFeeStatus => {
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
        sessionFeeStatus.componentList.forEach(component => {
            let amountDue = this.getComponentFeesDue(component);
            if(amountDue > amountLeft) {
                this.handleComponentPaymentChange(component, amountLeft);
                amountLeft = 0;
            } else {
                amountLeft -= amountDue;
                this.handleComponentPaymentChange(component, amountDue);
            }
        });
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
        if (component.frequency === 'ANNUALLY') {
            component.payment = payment;
        } else if (component.frequency === 'MONTHLY') {
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
        if (component.frequency === 'ANNUALLY') {
            payment = component.payment;
        } else if (component.frequency === 'MONTHLY') {
            component.monthList.forEach( componentMonthly => {
                payment += componentMonthly.payment;
            });
        }
        return payment;
    }

    getComponentTotalFee(component: any): number {
        let amount = 0;
        if (component.frequency === 'ANNUALLY') {
            amount += component.amount;
        } else if (component.frequency === 'MONTHLY') {
            component.monthList.forEach( componentMonthly => {
                amount += componentMonthly.amount;
            });
        }
        return amount;
    }

    getComponentFeesDue(component: any): number {
        let amountDue = 0;
        if (component.frequency === 'ANNUALLY') {
            amountDue += component.amountDue;
        } else if (component.frequency === 'MONTHLY') {
            component.monthList.forEach( componentMonthly => {
                amountDue += componentMonthly.amountDue;
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

}
