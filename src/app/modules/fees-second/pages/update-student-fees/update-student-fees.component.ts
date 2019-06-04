import { Component, Input } from '@angular/core';
import {style, state, trigger, animate, transition} from "@angular/animations";



import { FeeOldService } from '../../fee-old.service';
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
    selector: 'app-update-student-fees',
    templateUrl: './update-student-fees.component.html',
    styleUrls: ['./update-student-fees.component.css'],
    providers: [ FeeOldService ],
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

export class UpdateStudentFeesComponent {

    @Input() user;

    selectedStudent: any;

    studentFeeStatus: any;

    remark: string;

    isLoading = false;

    frequencyList = FREQUENCY_LIST;

    constructor (private feeService: FeeOldService) { }

    getStudentFeeDetails(student: any): void {
        const data = {
            studentDbId: student.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        this.selectedStudent = student;
        this.getStudentFeeStatus(data);
    }

    getStudentFeeStatus(data: any): void {
        this.isLoading = true;
        this.studentFeeStatus = null;
        this.feeService.getStudentSessionFeeStatus(data, this.user.jwt).then( studentFeeStatus => {
            this.isLoading = false;
            if (this.selectedStudent.dbId === data['studentDbId']) {
                this.initializeStudentFeeStatus(studentFeeStatus);
            }
            console.log(this.studentFeeStatus);
        }, error => {
            this.isLoading = false;
            alert('error');
        });
    }

    initializeStudentFeeStatus(studentFeeStatus: any): void {
        this.studentFeeStatus = studentFeeStatus;
        this.studentFeeStatus.componentList.forEach(component => {
            if (component.frequency === this.frequencyList[0]) {
                component.initialAmount = component.amount;
            } else if (component.frequency === this.frequencyList[1]) {
                component.monthList.forEach( monthlyComponent => {
                    monthlyComponent.initialAmount = monthlyComponent.amount;
                });
            }
        });
    }

    updateStudentFees(): void {
        let data = {
            studentDbId: this.selectedStudent.dbId,
            studentFeeStatus: this.studentFeeStatus,
        };
        this.isLoading = true;
        this.feeService.updateStudentFeeStatus(data, this.user.jwt).then( studentFeeStatus => {
            this.isLoading = false;
            alert('Students Fee updated successfully');
            if (this.selectedStudent.dbId = data['studentDbId']) {
                this.initializeStudentFeeStatus(studentFeeStatus);
            }
            console.log(this.studentFeeStatus);
        }, error => {
            this.isLoading = false;
            alert('error');
        });
    }

    // Session Fee
    /*getSessionTotalFee(sessionFeeStatus: any): number {
        let amount = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amount += this.getComponentTotalFee(component);
        });
        return amount;
    }

    getSessionSchoolTotalFee(sessionFeeStatus: any): number {
        let amount = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amount += this.getComponentSchoolTotalFee(component);
        });
        return amount;
    }

    getSessionFeesDue(sessionFeeStatus: any): number {
        let amountDue = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amountDue += this.getComponentFeesDue(component);
        });
        return amountDue;
    }*/

    // Student Fee
    getStudentTotalFeeInitialValue(): number {
        let amount = 0;
        this.studentFeeStatus.componentList.forEach(component => {
            amount += this.getComponentTotalFeeInitialValue(component);
        });
        return amount;
    }

    getStudentTotalFeeFinalValue(): number {
        let amount = 0;
        this.studentFeeStatus.componentList.forEach(component => {
            amount += this.getComponentTotalFeeFinalValue(component);
        });
        return amount;
    }

    // Component Fee
    getComponentTotalFeeInitialValue(component: any): number {
        let amount = 0;
        if (component.frequency === this.frequencyList[0]) {
            amount += component.initialAmount;
        } else if (component.frequency === this.frequencyList[1]) {
            component.monthList.forEach( componentMonthly => {
                amount += this.getComponentMonthlyTotalFeeInitialValue(componentMonthly);
            });
        }
        return amount;
    }

    getComponentTotalFeeFinalValue(component: any): number {
        let amount = 0;
        if (component.frequency === this.frequencyList[0]) {
            amount += component.amount;
        } else if (component.frequency === this.frequencyList[1]) {
            component.monthList.forEach( componentMonthly => {
                amount += this.getComponentMonthlyTotalFeeFinalValue(componentMonthly);
            });
        }
        return amount;
    }

    getComponentSchoolTotalFee(component: any): number {
        let amount = 0;
        if (component.frequency === this.frequencyList[0]) {
            amount += component.schoolAmount;
        } else if (component.frequency === this.frequencyList[1]) {
            component.monthList.forEach( componentMonthly => {
                amount += this.getComponentMonthlySchoolTotalFee(componentMonthly);
            });
        }
        return amount;
    }

    getComponentFeesDue(component: any): number {
        let amountDue = 0;
        if (component.frequency === this.frequencyList[0]) {
            amountDue += component.amountDue;
        } else if (component.frequency === this.frequencyList[1]) {
            component.monthList.forEach( componentMonthly => {
                // amountDue += componentMonthly.amountDue;
                amountDue += this.getComponentMonthlyFeesDue(componentMonthly);
            });
        }
        return amountDue;
    }

    policeComponentTotalFeeInput(component: any, event: any): boolean {
        let amountPaid = component.initialAmount-component.amountDue;
        let finalValue = Number(event.srcElement.value);
        if (isNaN(finalValue) || finalValue < amountPaid) {
            event.srcElement.value = amountPaid;
            component.amount = amountPaid;
            return false;
        } else if (finalValue === 0) {
            event.srcElement.value = amountPaid;
            component.amount = amountPaid;
            return false;
        }
        return true;
    }

    // Component Monthly Fee
    getComponentMonthlyTotalFeeInitialValue(componentMonthly: any): number {
        return componentMonthly.initialAmount;
    }

    getComponentMonthlyTotalFeeFinalValue(componentMonthly: any): number {
        return componentMonthly.amount;
    }

    getComponentMonthlySchoolTotalFee(componentMonthly: any): number {
        return componentMonthly.schoolAmount;
    }

    getComponentMonthlyFeesDue(componentMonthly: any): number {
        return componentMonthly.amountDue;
    }

    policeComponentMonthlyTotalFeeInput(componentMonthly: any, event: any): boolean {
        let amountPaid = componentMonthly.initialAmount-componentMonthly.amountDue;
        let finalValue = Number(event.srcElement.value);
        if (isNaN(finalValue) || finalValue < amountPaid) {
            event.srcElement.value = amountPaid;
            componentMonthly.amount = amountPaid;
            return false;
        } else if (finalValue === 0) {
            event.srcElement.value = amountPaid;
            componentMonthly.amount = amountPaid;
            return false;
        }
        return true;
    }

}
