import { Component, Input } from '@angular/core';

import { FeeService } from '../fee.service';

@Component({
    selector: 'app-collect-fee',
    templateUrl: './collect-fee.component.html',
    styleUrls: ['./collect-fee.component.css'],
    providers: [ FeeService ],
})
export class CollectFeeComponent {

    @Input() user;

    selectedStudent: any;

    studentFeeStatus: any;

    totalPayment = 0;

    isLoading = false;

    constructor (private feeService: FeeService) { }

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
                this.totalPayment = 0;
                console.log(studentFeeStatus);
            }
        }, error => {
            this.isLoading = false;
            alert('error');
        });
    }

    // Total Fee
    populateTotalFee(): void {
        this.studentFeeStatus.sessionFeeStatusList.forEach( sessionFeeStatus => {
            let amountDue = this.totalSessionFeesDue(sessionFeeStatus);
            if(amountDue > amountLeft) {
                sessionFeeStatus.payment = amountLeft;
                amountLeft = 0;
                this.handleSessionPaymentChange(sessionFeeStatus);
            } else {
                sessionFeeStatus.payment = amountDue;
                amountLeft -= amountDue;
                this.handleSessionPaymentChange(sessionFeeStatus);
            }
        });
    }

    handleTotalPaymentChange(totalPayment: number): void {
        let amountLeft = totalPayment;
        this.studentFeeStatus.sessionFeeStatusList.forEach( sessionFeeStatus => {
            let amountDue = this.totalSessionFeesDue(sessionFeeStatus);
            if(amountDue > amountLeft) {
                this.handleSessionPaymentChange(sessionFeeStatus, amountLeft);
                amountLeft = 0;
            } else {
                this.handleSessionPaymentChange(sessionFeeStatus, amountDue);
                amountLeft -= amountDue;
            }
        });
    }

    totalFeesDue(): number {
        let amountDue = 0;
        this.studentFeeStatus.sessionFeeStatusList.forEach(sessionFeeStatus => {
            amountDue += this.totalSessionFeesDue(sessionFeeStatus);
        });
        return amountDue;
    }

    // Session Fee
    handleSessionPaymentChange(sessionFeeStatus: any, sessionPayment: number): void {
        let amountLeft = sessionPayment;
        sessionFeeStatus.componentList.forEach(component => {
            let amountDue = this.totalComponentFeesDue(component);
            if(amountDue > amountLeft) {
                component.payment = amountLeft;
                amountLeft = 0;
                this.handleComponentPaymentChange(component);
            } else {
                component.payment = amountDue;
                amountLeft -= amountDue;
                this.handleComponentPaymentChange(component);
            }
        });
        this.populateTotalFee();
    }

    totalSessionPayment(sessionFeeStatus: any): number {
        let payment = 0;

    }

    totalSessionFees(sessionFeeStatus: any): number {
        let amount = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amount += this.totalComponentFees(component);
        });
        return amount;
    }

    totalSessionFeesDue(sessionFeeStatus: any): number {
        let amountDue = 0;
        sessionFeeStatus.componentList.forEach(component => {
            amountDue += this.totalComponentFeesDue(component);
        });
        return amountDue;
    }


    // Component Fee
    handleComponentPaymentChange(component: any): void {
        let amountLeft = component.payment;
        if (component.frequency === 'ANNUALLY') {
            // Nothing to do
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

    totalComponentFees(component: any): number {
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

    totalComponentFeesDue(component: any): number {
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

    // Component Monthly Fee

    /*submitFee(): void {
        if (this.newFeeReceipt.receiptNumber === undefined || this.newFeeReceipt.receiptNumber === 0) {
            alert('Receipt No. should be populated');
            return;
        }
        if (this.newFeeReceipt.amount === undefined || this.newFeeReceipt.amount <= 0) {
            alert('Amount should be populated');
            return;
        }
        if (this.newFeeReceipt.generationDateTime === undefined) {
            alert('Date should be populated');
            return;
        }
        if (this.newFeeReceipt.remark === undefined) { this.newFeeReceipt.remark = ''; }
        this.isLoading = true;
        this.newFeeReceipt.studentDbId = this.selectedStudent.dbId;
        this.feeService.submitFee(this.newFeeReceipt, this.user.jwt).then(
            data => {
                this.isLoading = false;
                if (data.status === 'success') {
                    alert(data.message);
                    const student = data.studentData;
                    if (this.selectedStudent.dbId === student.dbId) {
                        student.name = this.selectedStudent.name;
                        student.className = this.selectedStudent.className;
                        student.sectionName = this.selectedStudent.sectionName;
                        student.feesList.forEach( fee => {
                            fee.studentName = student.name;
                            fee.fathersName = student.fathersName;
                            fee.className = student.className;
                            fee.sectionName = student.sectionName;
                        });
                        student.concessionList.forEach( concession => {
                            concession.studentName = student.name;
                            concession.className = student.className;
                        });
                        this.selectedStudent.copy(student);
                    }
                    this.selectedStudent.feesList.forEach( fee => {
                        if (fee.receiptNumber === this.newFeeReceipt.receiptNumber) {
                            this.printFeeReceipt(fee);
                        }
                    });
                    if (student.overAllLastFeeReceiptNumber === null || student.overAllLastFeeReceiptNumber === '') {
                        student.overAllLastFeeReceiptNumber = 0;
                    }
                    this.newFeeReceipt.receiptNumber = student.overAllLastFeeReceiptNumber + 1;
                    this.newFeeReceipt.amount = 0;
                    this.newFeeReceipt.generationDateTime = moment(new Date()).format('YYYY-MM-DD');
                    this.newFeeReceipt.remark = '';
                } else if (data.status === 'fail') {
                    alert(data.message);
                } else {
                    alert('Server Response not recognized: Contact Admin');
                }
            }
        );

    }*/

    /*printFeeReceipt(fee: TempFee): void {
        EmitterService.get('print-fee-receipt').emit(fee);
    }*/

    /*createNewFeeReceipt(): void {
        EmitterService.get('new-fee-receipt-modal').emit(this.newFeeReceipt);
    }*/

    /*getStudentFeeData(student?: StudentExtended): void {
        this.isLoading = true;
        const data = {
            studentDbId: student.dbId,
        };
        this.feeService.getStudentFeeData(data, this.user.jwt).then(
            studentResponse => {
                this.isLoading = false;
                studentResponse.name = student.name;
                studentResponse.className = student.className;
                studentResponse.sectionName = student.sectionName;
                studentResponse.feesList.forEach( fee => {
                    fee.studentName = student.name;
                    fee.scholarNumber = studentResponse.scholarNumber;
                    fee.fathersName = studentResponse.fathersName;
                    fee.className = student.className;
                    fee.sectionName = student.sectionName;
                });
                studentResponse.concessionList.forEach( concession => {
                    concession.studentName = student.name;
                    concession.className = student.className;
                    concession.sectionName = student.sectionName;
                    concession.scholarNumber = student.scholarNumber;
                });
                this.selectedStudent.copy(studentResponse);
                if (studentResponse.overAllLastFeeReceiptNumber === null || studentResponse.overAllLastFeeReceiptNumber === '') {
                    studentResponse.overAllLastFeeReceiptNumber = 0;
                }
                this.newFeeReceipt.receiptNumber = studentResponse.overAllLastFeeReceiptNumber + 1;
            }
        );
    }*/

}
