import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PurchaseSmsServiceAdapter } from './purchase-sms.service.adapter';
import { UserService } from "../../../../services/modules/user/user.service";
import { SmsService } from "../../../../services/modules/sms/sms.service";
import { WindowRefService } from "../../../../services/modules/sms/window-ref.service";
import { DataStorage } from 'app/classes/data-storage';
import { SmsOldService } from 'app/services/modules/sms/sms-old.service';
import { RazorpayServiceAdapter } from '../razor-pay/razor-pay.service.adapter';
import { isMobile } from '../../../../classes/common.js';


@Component({
  selector: 'app-purchase-sms',
  templateUrl: './purchase-sms.component.html',
  styleUrls: ['./purchase-sms.component.css'],
  providers: [UserService, SmsService, WindowRefService],

})
export class PurchaseSmsComponent implements OnInit {


  user;
  serviceAdapter: PurchaseSmsServiceAdapter;
  razorPayServiceAdapter: RazorpayServiceAdapter;
  isLoading = false;
  isInitialLoading = false;

  smsPlan = [
    { noOfSms: 5000, selected: false },
    { noOfSms: 20000, selected: false },
    { noOfSms: 30000, selected: false }
  ];


  smsBalance = 0;
  noOfSMS = 100;


  constructor(public smsService: SmsService,
    public smsOldService: SmsOldService,
    public userService: UserService,
    public winRef: WindowRefService,
    public cdRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new PurchaseSmsServiceAdapter();
    this.razorPayServiceAdapter = new RazorpayServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
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
    if (!this.isMobile())
      bubble.style.left = `calc(${this.noOfSMS * (30 / 30000) + 1}vw)`;
    else
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

  // isPayButtonDisabled()
  // {
  //   if(this.noOfSMS >=100)return false;
  //   return true;
  // }

  CallcreateRzpayOrder() {
    let data = {
      price: this.getPrice(this.noOfSMS),
      noOfSMS: this.noOfSMS,
      user: this.user,
      smsBalance: this.smsBalance,
    };
    this.isLoading = true;
    this.razorPayServiceAdapter.createRzpayOrder(data, this.smsService, this.winRef).then(value => {
      this.smsBalance += this.noOfSMS;
      this.noOfSMS = 100;
      this.callSetBubble('', 0);
      this.cdRef.detectChanges();
      this.isLoading = false;

    });

  }

  getPrice(noOfSMS) {
    return noOfSMS * 0.25;
  }

  isMobile(): boolean {
    return isMobile();
  }

}
