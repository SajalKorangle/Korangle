import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-dailog',
  templateUrl: './payment-dailog.component.html',
  styleUrls: ['./payment-dailog.component.css']
})
export class PaymentDailogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PaymentDailogComponent>, @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any; }) { }

  ngOnInit() {
  }

  // apply() {
  //   this.dialogRef.close({ data to send });
  // }

}
