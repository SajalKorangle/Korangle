import { Component, OnInit } from '@angular/core';
import { PurchaseSmsHtmlAdapter } from '@modules/sms/pages/purchase-sms-2/purchase-sms.html.adapter';
import { PurchaseSmsServiceAdapter } from '@modules/sms/pages/purchase-sms-2/purchase-sms.service.adapter';
import { DataStorage } from '@classes/data-storage';
import { VALIDATORS_REGX } from '@classes/regx-validators';
import { PaymentService } from '@services/modules/payment/payment.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-purchase-sms-dialog-easebuzz',
  templateUrl: './purchase-sms-dialog-easebuzz.component.html',
  styleUrls: ['./purchase-sms-dialog-easebuzz.component.css'],
  providers: [PaymentService],
})
export class PurchaseSmsDialogEasebuzzComponent implements OnInit {
    user: any;
    htmlAdapter: PurchaseSmsHtmlAdapter;
    serviceAdapter: PurchaseSmsServiceAdapter;
    validatorRegex = VALIDATORS_REGX;


    constructor(public dialog: MatDialog, public paymentService: PaymentService) { }

    ngOnInit() {

        this.user = DataStorage.getInstance().getUser();

        this.htmlAdapter = new PurchaseSmsHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);

        this.serviceAdapter = new PurchaseSmsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

    makeSmsPurchase() {
        if (!this.htmlAdapter.email) {
            alert("Email is required");
            return;
        }
        if (!VALIDATORS_REGX.email.test(this.htmlAdapter.email)) {
            alert("Invalid Email");
            return;
        }
        this.htmlAdapter.isLoading = true;
        this.serviceAdapter.makeSmsPurchase(this.htmlAdapter.noOfSMS, this.htmlAdapter.email);
    }
}
