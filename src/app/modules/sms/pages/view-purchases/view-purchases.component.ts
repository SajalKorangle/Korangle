import { Component, Input, OnInit } from '@angular/core';

import { SmsService } from '../../sms.service';

@Component({
  selector: 'view-purchases',
  templateUrl: './view-purchases.component.html',
  styleUrls: ['./view-purchases.component.css'],
})
export class ViewPurchasesComponent implements OnInit{

    @Input() user;

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

    constructor(private smsService: SmsService) { }

    ngOnInit(): void {
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
