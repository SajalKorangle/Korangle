import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PurchaseSmsServiceAdapter } from './purchase-sms.service.adapter';
import { UserService } from "../../../../services/modules/user/user.service";
import { SmsService } from "../../../../services/modules/sms/sms.service";
import { WindowRefService } from "../../../../services/modules/sms/window-ref.service";
import { DataStorage } from 'app/classes/data-storage';
import { SmsOldService } from 'app/services/modules/sms/sms-old.service';
import { CommonFunctions } from '@classes/common-functions';
import { GeneralSMSPurchaseServiceAdapter } from '@modules/sms/class/sms-purchase.service.adapter';
import { PaymentService } from '@services/modules/payment/payment.service';
import { SMS_PLAN } from '@modules/sms/class/constants';
import { VALIDATORS_REGX } from '@classes/regx-validators';
import { PaymentResponseDialogComponent } from './../../components/payment-response-dialog/payment-response-dialog.component';
import { MatDialog } from '@angular/material';


@Component({
    selector: 'app-purchase-sms',
    templateUrl: './purchase-sms.component.html',
    styleUrls: ['./purchase-sms.component.css'],
    providers: [UserService, SmsService, PaymentService, WindowRefService],

})

export class PurchaseSmsComponent implements OnInit {


    user;
    serviceAdapter: PurchaseSmsServiceAdapter;
    generalSMSPurchaseServiceAdapter: GeneralSMSPurchaseServiceAdapter;
    isLoading = false;
    isInitialLoading = false;

    smsPlan = SMS_PLAN;


    smsBalance = 0;
    noOfSMS = 100;

    email: string = '';

    validatorRegex = VALIDATORS_REGX;

    isMobile = CommonFunctions.getInstance().isMobileMenu;


    constructor(public smsService: SmsService,
        public paymentService: PaymentService,
        public smsOldService: SmsOldService,
        public userService: UserService,
        public winRef: WindowRefService,
        public cdRef: ChangeDetectorRef,
        public dialog: MatDialog,) { }

    ngOnInit() {
        console.log(this);
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new PurchaseSmsServiceAdapter();
        this.generalSMSPurchaseServiceAdapter = new GeneralSMSPurchaseServiceAdapter(this);
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        if (this.user.email)
            this.email = this.user.email;

        const urlParams = new URLSearchParams(location.search);
        if (urlParams.has('orderId')) {
            this.openPaymentResponseDialog();
        }
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

    makeSmsPurchase() {
        if (!this.email) {
            alert("Email is required");
            return;
        }
        if (!VALIDATORS_REGX.email.test(this.email)) {
            alert("Invalid Email");
            return;
        }
        this.isLoading = true;
        this.generalSMSPurchaseServiceAdapter.makeSMSPurchase(this.noOfSMS, this.email);
    }

    openPaymentResponseDialog() {
        this.dialog.open(PaymentResponseDialogComponent, {
            data: {
                vm: this
            }
        });
    }

}
