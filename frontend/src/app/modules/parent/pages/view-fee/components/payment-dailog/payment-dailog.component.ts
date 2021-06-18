import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewFeeComponent } from './../../view-fee.component';
@Component({
  selector: 'app-payment-dailog',
  templateUrl: './payment-dailog.component.html',
  styleUrls: ['./payment-dailog.component.css']
})
export class PaymentDailogComponent implements OnInit {

  amountMappedByStudntId: { [key: number]: number; } = {};

  constructor(public dialogRef: MatDialogRef<PaymentDailogComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    vm: ViewFeeComponent;
  }) { }

  ngOnInit() {
    this.data.vm.selectedStudentList.forEach(student => { // initilizing payment amount to 0
      this.amountMappedByStudntId[student.id] = 0;
    });
  }

  amountError(student) {
    const amountErrorHandler = () => {  // callback error checking function, checkf if amount exceeds the maximum amount
      if (this.amountMappedByStudntId[student.id] < 0)
        return true;
      if (this.amountMappedByStudntId[student.id] > (this.data.vm.getStudentFeesDue(student) + this.data.vm.getStudentLateFeesDue(student)))
        return true;
      return false;
    };
    return amountErrorHandler;
  }

  // apply() {
  //   this.dialogRef.close({ data to send });
  // }

}
