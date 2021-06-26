import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewFeeComponent } from './../../view-fee.component';
import { SubFeeReceipt } from '@services/modules/fees/models/sub-fee-receipt';
import { StudentFee } from '@services/modules/fees/models/student-fee';
import { Student } from '@services/modules/student/models/student';
import { Session } from '@services/modules/school/models/session';
import { VALIDATORS_REGX } from '@classes/regx-validators';

@Component({
  selector: 'app-payment-dailog',
  templateUrl: './payment-dailog.component.html',
  styleUrls: ['./payment-dailog.component.css']
})
export class PaymentDailogComponent implements OnInit {

  email: string = '';
  amountMappedByStudntId: { [key: number]: number; } = {};
  newSubFeeReceiptListMappedByStudntId: { [key: number]: Array<Partial<SubFeeReceipt>>; } = {};

  validatorRegex = VALIDATORS_REGX;

  constructor(public dialogRef: MatDialogRef<PaymentDailogComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    vm: ViewFeeComponent;
  }) { }

  ngOnInit() {
    this.data.vm.selectedStudentList.forEach(student => { // initilizing
      this.newSubFeeReceiptListMappedByStudntId[student.id] = [];
    });
    console.log('payment Dialog: ', this);
  }

  amountError(student: Student) {
    const amountErrorHandler = () => {  // callback error checking function, checkf if amount exceeds the maximum amount
      if (this.amountMappedByStudntId[student.id] < 0)
        return true;
      if (this.amountMappedByStudntId[student.id] > (this.data.vm.getStudentFeesDue(student) + this.data.vm.getStudentLateFeesDue(student)))
        return true;
      return false;
    };
    return amountErrorHandler;
  }

  getOverallTotalPaymntAmount(): number {
    return Object.values(this.amountMappedByStudntId).reduce((acc, next) => acc + next, 0);
  }

  handleOverallPaymentChange(student: Student): void {
    if (this.amountError(student)())
      return;
    let paymentLeft = this.amountMappedByStudntId[student.id];
    this.newSubFeeReceiptListMappedByStudntId[student.id] = []; // start with empty

    if (paymentLeft == 0)
      return;

    this.data.vm.sessionList.forEach((session: Session) => {
      this.data.vm.installmentList.forEach((installment) => {
        this.data.vm.getFilteredStudentFeeListBySession(student, session).forEach((studentFee: StudentFee) => {
          let installmentLateFeesDue = this.data.vm.getStudentFeeInstallmentLateFeesDue(studentFee, installment);
          if (installmentLateFeesDue > 0) {
            if (paymentLeft > installmentLateFeesDue) {
              this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, installmentLateFeesDue);
              paymentLeft -= installmentLateFeesDue;
            } else {
              this.handleStudentFeeInstallmentLateFeePaymentChange(studentFee, installment, paymentLeft);
              paymentLeft = 0;
            }
          }
          let installmentFeesDue = this.data.vm.getStudentFeeInstallmentFeesDue(studentFee, installment);
          if (installmentFeesDue > 0) {
            if (paymentLeft > installmentFeesDue) {
              this.handleStudentFeeInstallmentPaymentChange(studentFee, installment, installmentFeesDue);
              paymentLeft -= installmentFeesDue;
            } else {
              this.handleStudentFeeInstallmentPaymentChange(studentFee, installment, paymentLeft);
              paymentLeft = 0;
            }
          }
        });
      });
    });
  }

  handleStudentFeeInstallmentLateFeePaymentChange(studentFee: StudentFee, installment: string, payment: number): void {
    if (payment == 0)
      return;
    let subFeeReceipt = this.newSubFeeReceiptListMappedByStudntId[studentFee.parentStudent].find((subFeeReceipt) => {
      return subFeeReceipt.parentStudentFee == studentFee.id;
    });

    if (subFeeReceipt) {
      subFeeReceipt[installment + 'LateFee'] = payment;

    } else {
      this.createNewSubFeeReceipt(studentFee, installment + 'LateFee', payment);
    }
  }

  createNewSubFeeReceipt(studentFee: StudentFee, installment: any, payment: any): void {
    let subFeeReceipt = new SubFeeReceipt();
    subFeeReceipt.parentStudentFee = studentFee.id;
    subFeeReceipt.parentFeeType = studentFee.parentFeeType;
    subFeeReceipt.parentSession = studentFee.parentSession;
    subFeeReceipt.isAnnually = studentFee.isAnnually;
    subFeeReceipt[installment] = payment;
    this.newSubFeeReceiptListMappedByStudntId[studentFee.parentStudent].push(subFeeReceipt);
  }

  handleStudentFeeInstallmentPaymentChange(studentFee: StudentFee, installment: string, payment: number): void {
    if (payment == 0)
      return;
    let subFeeReceipt = this.newSubFeeReceiptListMappedByStudntId[studentFee.parentStudent].find((subFeeReceipt) => {
      return subFeeReceipt.parentStudentFee == studentFee.id;
    });

    if (subFeeReceipt) {
      subFeeReceipt[installment + 'Amount'] = payment;
    } else if (payment > 0) {
      this.createNewSubFeeReceipt(studentFee, installment + 'Amount', payment);
    }
  }

  getNewSubFeeReceiptTotalLateFee(student): number {
    let lateFee = 0;

    const subFeeReceiptList = this.newSubFeeReceiptListMappedByStudntId[student.id];
    subFeeReceiptList.forEach(subFeeReceipt => {
      this.data.vm.installmentList.forEach(installment => {
        if (subFeeReceipt[installment + 'LateFee'])
          lateFee += subFeeReceipt[installment + 'LateFee'];
      });
    });
    return lateFee;
  }

  getFeeTypeFromSubFeeReceipt(subFeeReceipt: SubFeeReceipt) {
    return this.data.vm.feeTypeList.find(feeType => feeType.id == subFeeReceipt.parentFeeType);
  }

  getTotalInstallmentAmount(subFeeReceipt: SubFeeReceipt) {
    let totalAmount = 0;

    this.data.vm.installmentList.forEach(installment => {
      if (subFeeReceipt[installment + 'Amount'])
        totalAmount += subFeeReceipt[installment + 'Amount'];
    });
    return totalAmount;
  }

  getSessionFilteredSubFeeReceiptList(student, session: Session): Array<Partial<SubFeeReceipt>> {
    return this.newSubFeeReceiptListMappedByStudntId[student.id].filter(subFeeReceipt => subFeeReceipt.parentSession == session.id);
  }

  apply() {

    // Email Test
    if (!VALIDATORS_REGX.email.test(this.email)) {
      alert('Email Validation Failed');
      return;
    }

    this.dialogRef.close({
      amountMappedByStudntId: this.amountMappedByStudntId,
      newSubFeeReceiptListMappedByStudntId: this.newSubFeeReceiptListMappedByStudntId,
      email: this.email,
    });
  }

}
