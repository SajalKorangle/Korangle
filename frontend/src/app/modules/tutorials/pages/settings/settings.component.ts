import {Component, OnInit, ViewChild} from '@angular/core';
import {SettingsServiceAdapter} from './settings.service.adapter';
import {TutorialsService} from '../../../../services/modules/tutorials/tutorials.service';
import {DataStorage} from '../../../../classes/data-storage';
import {SmsService} from '@services/modules/sms/sms.service';
import {SettingsHtmlRenderer} from '@modules/tutorials/pages/settings/settings.html.renderer';

declare const $: any;


@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [TutorialsService, SmsService],
})
export class SettingsComponent implements OnInit {
    serviceAdapter: SettingsServiceAdapter;
    htmlRenderer: SettingsHtmlRenderer;

    user: any;

    communicationTypeList = ['IMPLICIT', 'EXPLICIT', 'TRANSACTIONAL'];
    populatedSMSEventSettingsList = [];
    populatedSMSIdList = [];

    backendData = {
        smsEventSettingsList: [],
        customEventTemplateList: [],
        sentUpdateList: [{id: 1, name: 'NULL'}, {id: 2, name: 'SMS'}, {id: 3, name: 'NOTIFICATION'}, {id: 4, name: 'NOTIF./SMS'}],
        smsIdList: [],
        smsEventList: [],
    };

    userInput = {
        populatedSMSEventSettingsList: [],
    };

    stateKeeper = {
        isLoading: false,
    };


    constructor(public smsService: SmsService) {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SettingsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new SettingsHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);
    }

}
