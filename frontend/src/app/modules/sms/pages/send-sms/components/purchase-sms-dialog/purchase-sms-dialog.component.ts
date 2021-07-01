import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isMobile } from '@classes/common.js';

import { GeneralSMSPurchaseServiceAdapter } from '@modules/sms/class/sms-purchase.service.adapter';
import { PaymentService } from '@services/modules/payment/payment.service';
import { SmsService } from '@services/modules/sms/sms.service';
import { UserService } from '@services/modules/user/user.service';
import { SendSmsComponent } from '@modules/sms/pages/send-sms/send-sms.component';
import { SMS_PLAN } from '@modules/sms/class/constants';

@Component({
  selector: 'app-purchase-sms-dialog',
  templateUrl: './purchase-sms-dialog.component.html',
  styleUrls: ['./purchase-sms-dialog.component.css'],
  providers: [PaymentService, SmsService, UserService]
})
export class PurchaseSmsDialogComponent implements OnInit {

  email: string = '';

  generalSMSPurchaseServiceAdapter: GeneralSMSPurchaseServiceAdapter;

  smsPlan = SMS_PLAN;

  noOfSMS = 100;

  constructor(
    public smsService: SmsService,
    public paymentService: PaymentService,
    public userService: UserService,
    public dialogRef: MatDialogRef<PurchaseSmsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vm: SendSmsComponent; }) { }

  ngOnInit() {
    this.generalSMSPurchaseServiceAdapter = new GeneralSMSPurchaseServiceAdapter(this);
    if (this.data.vm.user.email)
      this.email = this.data.vm.user.email;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  callSetBubble(event, value) {
    this.isPlanSelected();
    let range = document.querySelector(".range");
    let bubble = document.querySelector(".bubble");
    this.setBubble(range, bubble, value);
  }

  setBubble(range, bubble, value) {
    if (value >= 100)
      this.noOfSMS = value;
    bubble.innerHTML = this.noOfSMS;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((this.noOfSMS - min) * 100) / (max - min));

    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  }

  isPlanSelected() {
    for (let i = 0; i < this.smsPlan.length; i++) {
      if (this.smsPlan[i].noOfSms === this.noOfSMS)
        this.smsPlan[i].selected = true;
      else
        this.smsPlan[i].selected = false;
    }
  }

  startPayment() {
    this.generalSMSPurchaseServiceAdapter.makeSMSPurchase(this.noOfSMS, this.email);
    this.dialogRef.close();
  }

  isMobile(): boolean {
    return isMobile();
  }

}
