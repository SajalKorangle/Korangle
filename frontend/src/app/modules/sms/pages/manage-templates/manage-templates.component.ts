import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { ManageTemplatesServiceAdapter } from './manage-templates.service.adapter';
import { ManageTemplatesHtmlRenderer } from './manage-templates.html.renderer';
import {SmsService} from '@services/modules/sms/sms.service';
import {RECEIVER_LIST} from '@modules/attendance/classes/constants';
import {
    COMMON_VARIABLES,
    COMMUNICATION_TYPE,
    EVENT_SETTING_PAGES,
    SENT_UPDATE_TYPE,
} from '@modules/sms/classes/constants';

@Component({
    selector: 'manage-templates',
    templateUrl: './manage-templates.component.html',
    styleUrls: ['./manage-templates.component.css' , 'manage-templates.component.scss'],
    providers: [ SmsService ],
})

export class ManageTemplatesComponent implements OnInit {

    user: any;

    serviceAdapter: ManageTemplatesServiceAdapter;
    htmlRenderer: ManageTemplatesHtmlRenderer;

    communicationTypeList = COMMUNICATION_TYPE;
    settingsPagesList = EVENT_SETTING_PAGES;
    sendUpdateToList = RECEIVER_LIST;

    commonVariables = COMMON_VARIABLES;


    statusChoiceList = ['APPROVED', 'PENDING', 'ALL'];
    panelsList = ['eventPanel', 'notificationPanel', 'smsPanel'];

    populatedSMSIdList = [];
    populatedSMSEventSettingsList = [];

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

        this.htmlRenderer = new ManageTemplatesHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new ManageTemplatesServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();

    }

    isDefaultSelected(smsEvent: any): boolean {
        return smsEvent.selectedSMSId.id == this.populatedSMSIdList.find(smsId => smsId.smsId == 'Default').id;
    }
}
