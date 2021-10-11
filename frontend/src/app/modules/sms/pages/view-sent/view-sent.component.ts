import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { InformationService } from '../../../../services/modules/information/information.service';
import { ViewSentServiceAdapter } from './view-sent.service.adapter';
import { DataStorage } from '../../../../classes/data-storage';
import {SmsService} from '@services/modules/sms/sms.service';
import {ViewSentHtmlRenderer} from '@modules/sms/pages/view-sent/view-sent.html.renderer';

@Component({
    selector: 'view-sent',
    templateUrl: './view-sent.component.html',
    styleUrls: ['./view-sent.component.css', './view-sent.component.scss'],
    providers: [InformationService, SmsService],
})
export class ViewSentComponent implements OnInit {
    STATUS_UNKNOWN = 'Unknown';

    user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();

    nullValue = null;

    populatedMessageTypeList = [];
    populatedSMSEventList = [];
    populatedSMSList = [];

    backendData = {
        smsList: [],
        messageTypeList: [],
        SMSEventList: []
    };

    userInput = {
        selectedStatus: null,
    };

    stateKeeper = {
        isLoading: false
    };

    serviceAdapter: ViewSentServiceAdapter;
    htmlRenderer: ViewSentHtmlRenderer;

    constructor(public informationService: InformationService, private cdRef: ChangeDetectorRef,
                public smsService: SmsService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewSentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new ViewSentHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);

        this.userInput.selectedStatus = this.STATUS_UNKNOWN;
    }

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return year + '-' + month + '-' + day;
    }

    getStatusList(sms: any): any {
        let statusList = [];
        if (sms.count != sms.deliveryReportList.length) {
            statusList.push(this.STATUS_UNKNOWN);
        }
        statusList = statusList.concat([...new Set(sms.deliveryReportList.map((a) => a.status))]);
        return statusList;
    }

}
