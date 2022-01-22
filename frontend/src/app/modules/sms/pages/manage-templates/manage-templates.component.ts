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

    smsIdListFilteredBySchoolId = [];
    populatedSelectedPageEventsData = [];

    userInput = {
        selectedPage: null,
        newTemplate: {} as any,
        selectedSMSId: {} as any,
        startDate: null,
        endDate: null,
        populatedSelectedPageEventsData: [],
        selectedEvent: null,
        selectedEventSettings: null,
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
        eventList: [],
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

    initializeNewTemplate() {
        this.userInput.newTemplate = {
            parentSMSId: null,
            templateId: null,
            templateName: null,
            rawContent: null,
            mappedContent: null,
        };
    }

    isDefaultSelected(smsEvent: any): boolean {
        return smsEvent.selectedSMSId.id == 0;
    }
}
