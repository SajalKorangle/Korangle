import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { ManageDefaultersTemplateServiceAdapter } from './manage-defaulters-template.service.adapter';
import { ManageDefaultersTemplateHtmlRenderer } from './manage-defaulters-template.html.renderer';
import {SmsService} from '@services/modules/sms/sms.service';

@Component({
    selector: 'manage-defaulters-template',
    templateUrl: './manage-defaulters-template.component.html',
    styleUrls: ['./manage-defaulters-template.component.css', 'manage-defaulters-template.component.scss'],
    providers: [ SmsService ],
})

export class ManageDefaultersTemplateComponent implements OnInit {

    user: any;

    serviceAdapter: ManageDefaultersTemplateServiceAdapter;
    htmlRenderer: ManageDefaultersTemplateHtmlRenderer;

    communicationTypeList = ['SERVICE IMPLICIT', 'SERVICE EXPLICIT', 'TRANSACTIONAL'];
    statusChoiceList = ['APPROVED', 'PENDING', 'ALL'];

    userInput = {
        newTemplate: {} as any,
        selectedSMSId: {} as any,
        selectedTemplateStatus: 'ALL',
        startDate: null,
        endDate: null,
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
        eventSettingsList: [],
        templateList: [],
        defaultersSMSEvent: {} as any,
    };
    stateKeeper = { isLoading: false };

    constructor (public smsService: SmsService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new ManageDefaultersTemplateHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new ManageDefaultersTemplateServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initializeData();

    }
}
