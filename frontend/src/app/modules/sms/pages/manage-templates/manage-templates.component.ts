import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { ManageTemplatesServiceAdapter } from './manage-templates.service.adapter';
import { ManageTemplatesHtmlRenderer } from './manage-templates.html.renderer';
import {SmsService} from '@services/modules/sms/sms.service';
import {RECEIVER_LIST} from '@modules/attendance/classes/constants';
import {EVENT_SETTING_PAGES} from '@modules/sms/pages/manage-templates/classes/constants';
import {InformationService} from '@services/modules/information/information.service';

@Component({
    selector: 'manage-templates',
    templateUrl: './manage-templates.component.html',
    styleUrls: ['./manage-templates.component.css' , 'manage-templates.component.scss'],
    providers: [ SmsService, InformationService ],
})

export class ManageTemplatesComponent implements OnInit {

    user: any;

    serviceAdapter: ManageTemplatesServiceAdapter;
    htmlRenderer: ManageTemplatesHtmlRenderer;

    settingsPagesList = EVENT_SETTING_PAGES;
    sendUpdateToList = RECEIVER_LIST;

    panelsList = ['eventPanel', 'notificationPanel', 'smsPanel'];

    populatedSMSIdList = [];
    populatedSMSEventSettingsList = [];

    NOTIFY_DEFAULTERS_SMS_EVENT_ID = 4;

    userInput = {
        selectedPage: null,
        newTemplate: {} as any,
        selectedSMSId: {} as any,
        startDate: null,
        endDate: null,
        populatedSMSEventSettingsList: [],
        selectedEvent: null,
    };

    columnFilter = {
        SMSId: true,
        creationDate: true,
        templateName: true,
        templateContent: true,
        templateId: false,
    };

    backendData = {
        SMSIdSchoolList: [],
        SMSIdList: [],
        selectedPageTemplateList: [],
        selectedPageDefaultTemplateList: [],
        selectedPageEventSettingsList: [],
        sendUpdateTypeList: [],
        SMSEventList: [],
    };

    stateKeeper = { isLoading: false };

    constructor (public smsService: SmsService,
                 public informationService: InformationService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new ManageTemplatesHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new ManageTemplatesServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();

    }

    isDefaultSelected(smsEvent: any): boolean {
        return smsEvent.selectedSMSId.id == 0;
    }
}
