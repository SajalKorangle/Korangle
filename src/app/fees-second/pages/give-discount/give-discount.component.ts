import { Component, Input } from '@angular/core';
import {style, state, trigger, animate, transition} from "@angular/animations";


import { FeeService } from '../../fee.service';

import { Concession } from '../../classes/common-functionalities';

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
    selector: 'app-give-discount',
    templateUrl: './give-discount.component.html',
    styleUrls: ['./give-discount.component.css'],
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

export class GiveDiscountComponent {

    @Input() user;

    selectedStudent: any;

    studentFeeStatusList: any;

    showDetails: boolean;

    showPreviousConcessionDetails: boolean;

    concessionList: any;

    remark: string;

    isLoading = false;

    constructor (private feeService: FeeService) { }

    getStudentFeeDetails(student: any): void {
        const data = {
            studentDbId: student.dbId,
        };
        this.selectedStudent = student;
        this.getStudentFeeStatus(data);
        this.getStudentConcessionList(data);
    }

    getStudentConcessionList(data): void {
        this.concessionList = null;
        this.feeService.getStudentConcessionList(data, this.user.jwt).then(concessionList => {
            if (this.selectedStudent.dbId === data['studentDbId']) {
                this.concessionList = concessionList;
                console.log(this.concessionList);
            }
        });
    }

    getStudentFeeStatus(data: any): void {
        this.isLoading = true;
        this.studentFeeStatusList = null;
        this.feeService.getStudentFeeStatus(data, this.user.jwt).then( studentFeeStatusList => {
            this.isLoading = false;
            if (this.selectedStudent.dbId === data['studentDbId']) {
                this.studentFeeStatusList = studentFeeStatusList;
                this.studentFeeStatusList.forEach(sessionFeeStatus => {
                    sessionFeeStatus.componentList.forEach( component => {
                        component.showDetails = false;
                        if (component.frequency === 'ANNUALLY') {
                            component.concession = 0;
                        } else if ( component.frequency === 'MONTHLY') {
                            component.monthList.forEach( componentMonthly => {
                                componentMonthly.concession = 0;
                            });
                        }
                    });
                });
                this.showDetails = true;
                this.showPreviousConcessionDetails = false;
                console.log(this.studentFeeStatusList);
            }
        }, error => {
            this.isLoading = false;
            alert('error');
        });
    }

    generateConcession(): void {

        let data = {
            studentDbId: this.selectedStudent.dbId,
            remark: (this.remark)?this.remark:null,
        };

        data['subConcessionList'] = [];

        this.studentFeeStatusList.forEach(sessionFeeStatus => {
            sessionFeeStatus.componentList.forEach( component => {
                if (this.getComponentConcession(component)) {
                    let subConcession = {
                        componentDbId: component.dbId,
                        // feeType: component.feeType,
                        amount: this.getComponentConcession(component),
                        frequency: component.frequency,
                    };
                    if (component.frequency === 'MONTHLY') {
                        subConcession['monthList'] = [];
                        component.monthList.forEach( componentMonthly => {
                            let subConcessionMonthly = {
                                month: componentMonthly.month,
                                amount: this.getComponentMonthlyConcession(componentMonthly),
                            };
                            subConcession['monthList'].push(subConcessionMonthly);
                        });
                    }
                    data['subConcessionList'].push(subConcession);
                }
            });
        });

        console.log(data);

        this.isLoading = true;
        this.remark = null;
        this.feeService.createConcession(data, this.user.jwt).then( response => {
            this.isLoading = false;
            alert(response['message']);

            this.studentFeeStatusList = response['studentFeeStatusList'];
            this.studentFeeStatusList.forEach(sessionFeeStatus => {
                sessionFeeStatus.componentList.forEach( component => {
                    component.showDetails = false;
                    if (component.frequency === 'ANNUALLY') {
                        component.concession = 0;
                    } else if ( component.frequency === 'MONTHLY') {
                        component.monthList.forEach( componentMonthly => {
                            componentMonthly.concession = 0;
                        });
                    }
                });
            });
            this.studentFeeStatusList.showDetails = false;

            this.concessionList.unshift(response['concession']);

        }, error => {
            this.isLoading = false;
        });

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

    getConcessionListTotalAmount(): number {
        return Concession.getConcessionListTotalAmount(this.concessionList);
    }

    getConcessionTotalAmount(concession: any): number {
        return Concession.getConcessionTotalAmount(concession);
    }

    // Student Concession & Fee
    toggleStudentFeeDetails(): void {
        if (this.studentFeeStatusList.showDetails) {
            this.studentFeeStatusList.showDetails = false;
        } else {
            this.studentFeeStatusList.showDetails = true;
        }
    }

    handleStudentConcessionChange(concession: number): void {
        if (concession === null) concession = 0;
        let amountLeft = concession;
        this.studentFeeStatusList.forEach(sessionFeeStatus => {
            let amountDue = this.getSessionFeesDue(sessionFeeStatus);
            if(amountDue > amountLeft) {
                this.handleSessionConcessionChange(sessionFeeStatus, amountLeft);
                amountLeft = 0;
            } else {
                this.handleSessionConcessionChange(sessionFeeStatus, amountDue);
                amountLeft -= amountDue;
            }
        });
    }

    getStudentConcession(): number {
        let concession = 0;
        this.studentFeeStatusList.forEach(sessionFeeStatus => {
            concession += this.getSessionConcession(sessionFeeStatus);
        });
        return concession;
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

    policeStudentConcessionInput(event: any): boolean {
        if (event.key !== '0' && event.key !== '1' && event.key !== '2' && event.key !== '3' &&
            event.key !== '4' && event.key !== '5' && event.key !== '6' && event.key !== '7' &&
            event.key !== '8' && event.key !== '9') {
            return false;
        }
        let studentFeesDue = this.getStudentFeesDue();
        let concession = Number(event.srcElement.value+''+event.key);
        if (concession > studentFeesDue) {
            event.srcElement.value = studentFeesDue;
            this.handleStudentConcessionChange(Number(event.srcElement.value));
            return false;
        }
        return true;
    }


    // Session Concession & Fee
    handleSessionConcessionChange(sessionFeeStatus: any, concession: number): void {
        if (concession === null) concession = 0;
        let amountLeft = concession;

        // handle Annual Components
        sessionFeeStatus.componentList.forEach(component => {
            if (component.frequency === 'ANNUALLY') {
                let amountDue = this.getComponentFeesDue(component);
                if(amountDue > amountLeft) {
                    this.handleComponentConcessionChange(component, amountLeft);
                    amountLeft = 0;
                } else {
                    amountLeft -= amountDue;
                    this.handleComponentConcessionChange(component, amountDue);
                }
            }
        });

        // handle Monthly Components
        for (let i=0; i<12; ++i) {
            sessionFeeStatus.componentList.forEach(component => {
                if (component.frequency === 'MONTHLY') {
                    let amountDue = component.monthList[i].amountDue;
                    if (amountDue > amountLeft) {
                        component.monthList[i].concession = amountLeft;
                        amountLeft = 0;
                    } else {
                        component.monthList[i].concession = amountDue;
                        amountLeft -= amountDue;
                    }
                }
            });
        }
    }

    getSessionConcession(sessionFeeStatus: any): number {
        let concession = 0;
        sessionFeeStatus.componentList.forEach(component => {
            concession += this.getComponentConcession(component);
        });
        return concession;
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

    policeSessionConcessionInput(sessionFeeStatus: any, event: any): boolean {
        if (event.key !== '0' && event.key !== '1' && event.key !== '2' && event.key !== '3' &&
            event.key !== '4' && event.key !== '5' && event.key !== '6' && event.key !== '7' &&
            event.key !== '8' && event.key !== '9') {
            return false;
        }
        let sessionFeesDue = this.getSessionFeesDue(sessionFeeStatus);
        let concession = Number(event.srcElement.value+''+event.key);
        if (concession > sessionFeesDue) {
            event.srcElement.value = sessionFeesDue;
            this.handleSessionConcessionChange(sessionFeeStatus, Number(event.srcElement.value));
            return false;
        }
        return true;
    }

    // Component Concession & Fee
    toggleComponentFeeDetails(component: any): void {
        component.showDetails = !component.showDetails;
    }

    handleComponentConcessionChange(component: any, concession: number): void {
        if (concession === null) concession = 0;
        let amountLeft = concession;
        if (component.frequency === 'ANNUALLY') {
            component.concession = concession;
        } else if (component.frequency === 'MONTHLY') {
            component.monthList.forEach(componentMonthly => {
                let amountDue = componentMonthly.amountDue;
                if (amountDue > amountLeft) {
                    componentMonthly.concession = amountLeft;
                    amountLeft = 0;
                } else {
                    componentMonthly.concession = amountDue;
                    amountLeft -= amountDue;
                }
            });
        }
    }

    getComponentConcession(component: any): number {
        let concession = 0;
        if (component.frequency === 'ANNUALLY') {
            concession = component.concession;
        } else if (component.frequency === 'MONTHLY') {
            component.monthList.forEach( componentMonthly => {
                // concession += componentMonthly.concession;
                concession += this.getComponentMonthlyConcession(componentMonthly);
            });
        }
        return concession;
    }

    getComponentTotalFee(component: any): number {
        let amount = 0;
        if (component.frequency === 'ANNUALLY') {
            amount += component.amount;
        } else if (component.frequency === 'MONTHLY') {
            component.monthList.forEach( componentMonthly => {
                // amount += componentMonthly.amount;
                amount += this.getComponentMonthlyTotalFee(componentMonthly);
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
                // amountDue += componentMonthly.amountDue;
                amountDue += this.getComponentMonthlyFeesDue(componentMonthly);
            });
        }
        return amountDue;
    }

    policeComponentConcessionInput(component: any, event: any): boolean {
        if (event.key !== '0' && event.key !== '1' && event.key !== '2' && event.key !== '3' &&
            event.key !== '4' && event.key !== '5' && event.key !== '6' && event.key !== '7' &&
            event.key !== '8' && event.key !== '9') {
            return false;
        }
        let componentFeesDue = this.getComponentFeesDue(component);
        let concession = Number(event.srcElement.value+''+event.key);
        if (concession > componentFeesDue) {
            event.srcElement.value = componentFeesDue;
            this.handleComponentConcessionChange(component, Number(event.srcElement.value));
            return false;
        }
        return true;
    }


    // Component Monthly Fee
    getComponentMonthlyConcession(componentMonthly: any): number {
        return componentMonthly.concession;
    }

    getComponentMonthlyTotalFee(componentMonthly: any): number {
        return componentMonthly.amount;
    }

    getComponentMonthlyFeesDue(componentMonthly: any): number {
        return componentMonthly.amountDue;
    }


}
