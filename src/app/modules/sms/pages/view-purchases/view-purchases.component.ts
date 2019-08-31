import { Component, Input, OnInit } from '@angular/core';

import { SmsOldService } from '../../sms-old.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'view-purchases',
  templateUrl: './view-purchases.component.html',
  styleUrls: ['./view-purchases.component.css'],
})
export class ViewPurchasesComponent implements OnInit{

    user;

    smsPurchaseList: any;

    isLoading = false;

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return year + '-' + month + '-' + day;
    }

    constructor(private smsService: SmsOldService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.isLoading = true;
        let data = {
            'parentSchool': this.user.activeSchool.dbId,
        };
        this.smsService.getSMSPurchaseList(data, this.user.jwt).then(smsPurchaseList => {
            this.isLoading = false;
            this.smsPurchaseList = smsPurchaseList;
            console.log(smsPurchaseList);
        }, error => {
            this.isLoading = false;
        });
    }

}
