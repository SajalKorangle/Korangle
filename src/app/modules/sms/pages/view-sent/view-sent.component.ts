import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { SmsOldService } from '../../../../services/modules/sms/sms-old.service';
import { ViewSentServiceAdapter } from './view-sent.service.adapter';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'view-sent',
  templateUrl: './view-sent.component.html',
  styleUrls: ['./view-sent.component.css', './view-sent.component.scss'],
})
export class ViewSentComponent implements OnInit {

    STATUS_UNKNOWN = 'Unknown';

    user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();

    smsList: any;

    selectedStatus;

    serviceAdapter: ViewSentServiceAdapter;

    isLoading = false;

    constructor(public smsService: SmsOldService,
                private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewSentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.selectedStatus = this.STATUS_UNKNOWN;
    }

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return year + '-' + month + '-' + day;
    }

    getSMSList(): void {
        const data = {
            startDateTime: this.startDate.toString() + ' 00:00:00%2B05:30',
            endDateTime: this.endDate.toString() + ' 23:59:59%2B05:30',
            parentSchool: this.user.activeSchool.dbId,
        };
        this.isLoading = true;
        this.smsList = null;
        this.smsService.getSMSList(data, this.user.jwt).then(smsList => {
            this.isLoading = false;
            this.smsList = smsList;
        }, error => {
            this.isLoading = false;
        });
    }

    getStatusList(sms: any): any {
        let statusList = [];
        if (sms.count != sms.deliveryReportList.length) {
            statusList.push(this.STATUS_UNKNOWN);
        }
        statusList = statusList.concat([...new Set(sms.deliveryReportList.map(a => a.status))]);
        return statusList;
    }

    getMobileNumberListBySMS(sms: any): any {
        return sms.mobileNumberList.split(',').filter(item => {
            return item != null && item != "";
        });
    }

    getMobileNumberListByStatusAndSMS(status: any, sms: any): any {
        let mobileNumberList = [];
        if (status == this.STATUS_UNKNOWN) {
            let subtractMobileNumberList = sms.deliveryReportList.map(a => a.mobileNumber.toString());
            mobileNumberList = sms.mobileNumberList.split(',').filter(item => {
                return item != null && item != "" && !subtractMobileNumberList.includes(item);
            });
        } else {
            mobileNumberList = sms.deliveryReportList.filter(item => {
                return item.status == status;
            }).map(a => a.mobileNumber);
        }
        return mobileNumberList;
    }

}
