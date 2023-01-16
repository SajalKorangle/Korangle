import { Component, OnInit } from '@angular/core';
import { PurchaseSmsHtmlAdapter } from './purchase-sms.html.adapter';
import { PurchaseSmsServiceAdapter } from './purchase-sms.service.adapter';
import { DataStorage } from '@classes/data-storage';


@Component({
    selector: 'app-purchase-sms',
    templateUrl: './purchase-sms.component.html',
    styleUrls: ['./purchase-sms.component.css'],
})


export class PurchaseSmsComponent implements OnInit {

    user: any;

    htmlAdapter: PurchaseSmsHtmlAdapter;
    serviceAdapter: PurchaseSmsServiceAdapter;

    constructor() { }

    ngOnInit() {

        this.user = DataStorage.getInstance().getUser();

        this.htmlAdapter = new PurchaseSmsHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);

        this.serviceAdapter = new PurchaseSmsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

}
