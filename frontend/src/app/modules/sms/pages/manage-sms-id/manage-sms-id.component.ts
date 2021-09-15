import {Component, OnInit} from '@angular/core';

import {DataStorage} from '@classes/data-storage';

import {ManageSmsIdServiceAdapter} from './manage-sms-id.service.adapter';
import {ManageSmsIdHtmlRenderer} from './manage-sms-id.html.renderer';
import {SmsService} from '@services/modules/sms/sms.service';

@Component({
    selector: 'page-name',
    templateUrl: './manage-sms-id.component.html',
    styleUrls: ['./manage-sms-id.component.css'],
    providers: [SmsService],
})

export class ManageSmsIdComponent implements OnInit {

    user: any;

    serviceAdapter: ManageSmsIdServiceAdapter;
    htmlRenderer: ManageSmsIdHtmlRenderer;
    smsIdPattern = /^[a-zA-Z]{6}$/;

    statusChoiceList = ['ACTIVATED', 'PENDING', 'ALL'];

    userInput = {
        newSMSId: {} as any,
        selectedSMSStatus: 'ALL',
    };

    backendData = {
        SMSIdList: [],
        SMSIdSchoolList: [],
        existingSMSIdDetails: null as any,
        templateList: []
    };

    stateKeeper = {
        isPageLoading: false,
        isSMSIdTableLoading: false
    };

    constructor(public smsService: SmsService) {
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new ManageSmsIdHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new ManageSmsIdServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();

    }
}
