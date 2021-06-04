import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { SmsEventSettingsServiceAdapter } from './sms-event-settings.service.adapter';
import { SmsEventSettingsHtmlRenderer } from './sms-event-settings.html.renderer';
import {SmsService} from '@services/modules/sms/sms.service';
import {RECEIVER_LIST} from '@modules/attendance/classes/constants';
import {
    COMMON_VARIABLES,
    COMMUNICATION_TYPE,
    EVENT_SETTING_PAGES,
    SENT_UPDATE_TYPE,
} from '@modules/sms/classes/constants';

@Component({
    selector: 'sms-event-settings',
    templateUrl: './sms-event-settings.component.html',
    styleUrls: ['./sms-event-settings.component.css' , 'sms-event-settings.component.scss'],
    providers: [ SmsService ],
})

export class SmsEventSettingsComponent implements OnInit {

    user: any;

    serviceAdapter: SmsEventSettingsServiceAdapter;
    htmlRenderer: SmsEventSettingsHtmlRenderer;

    communicationTypeList = COMMUNICATION_TYPE;
    settingsPagesList = EVENT_SETTING_PAGES;
    sendUpdateToList = RECEIVER_LIST;

    commonVariables = COMMON_VARIABLES;


    statusChoiceList = ['APPROVED', 'PENDING', 'ALL'];
    panelsList = ['eventPanel', 'notificationPanel', 'smsPanel'];

    populatedSMSIdList = [];
    populatedSMSEventSettingsList = [];

    variableRegex = /\B@([\w+\\#%*(){}.,$!=\-/[\]]?)+/g;
    previousPage = null;

    userInput = {
        selectedPage: null,
        newTemplate: {} as any,
        selectedSMSId: {} as any,
        selectedTemplateStatus: 'ALL',
        startDate: null,
        endDate: null,
        populatedSMSEventSettingsList: [],
    };

    columnFilter = {
        SMSId: true,
        creationDate: true,
        templateName: true,
        templateContent: true,
        templateStatus: true,
        templateId: false,
    };
    backendData = {
        SMSIdSchoolList: [],
        SMSIdList: [],
        selectedPageSMSEventList: [],
        selectedPageTemplateList: [],
        selectedPageEventSettingsList: [],
        smsEventList: [],
        sentUpdateList: SENT_UPDATE_TYPE,
    };
    stateKeeper = { isLoading: false };

    constructor (public smsService: SmsService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new SmsEventSettingsHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new SmsEventSettingsServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();

    }

    isDefaultSelected(smsEvent: any): boolean {
        return smsEvent.selectedSMSId.id == this.populatedSMSIdList.find(smsId => smsId.smsId == 'Default').id;
    }
}
