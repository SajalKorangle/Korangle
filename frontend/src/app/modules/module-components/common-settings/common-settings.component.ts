import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SmsService} from '@services/modules/sms/sms.service';
import {CommonSettingsServiceAdapterComponent} from '@modules/module-components/common-settings/common-settings.service.adapter.component';
import {CommonSettingsHtmlRendererComponent} from '@modules/module-components/common-settings/common-settings.html.renderer.component';

@Component({
    selector: 'common-settings',
    templateUrl: './common-settings.component.html',
    styleUrls: ['./common-settings.component.css'],
    providers: [SmsService],
})

export class CommonSettingsComponent implements OnInit {

    @Input() user;

    @Input() orderedEventNames;  // Format [{name:'Event Name1'},{name:'Event Name2'}]

    @Input() sendUpdateTo = false; // whether to specify sendUpdate

    @Input() sendUpdateToList = []; // for SendUpdate dropdown

    @Input() extraVariables = []; // extra variables available for user

    @Output() isLoading = new EventEmitter<any>();

    serviceAdapter: CommonSettingsServiceAdapterComponent;
    htmlRenderer: CommonSettingsHtmlRendererComponent;

    commonVariables = ['studentName', 'date', 'schoolName', 'class'];
    communicationTypeList = ['SERVICE IMPLICIT', 'SERVICE EXPLICIT', 'TRANSACTIONAL'];
    panelsList = ['eventPanel', 'notificationPanel', 'smsPanel'];

    populatedSMSEventSettingsList = [];
    populatedSMSIdList = [];

    variableRegex = /\B@([\w+\\#%*(){}.,$!=\-/[\]]?)+/g;

    backendData = {
        smsEventSettingsList: [],
        customEventTemplateList: [],
        sentUpdateList: [{id: 1, name: 'NULL'}, {id: 2, name: 'SMS'}, {id: 3, name: 'NOTIFICATION'}, {id: 4, name: 'NOTIF./SMS'}],
        smsIdList: [],
        smsEventList: [],
    };

    userInput = {
        populatedSMSEventSettingsList: [], // for all events
        /*
         eventName,
         defaultNotificationContent,
         defaultSMSContent,
         eventSettings,
         customTemplate
         smsId
         */
    };

    stateKeeper = {
        isLoading: false,
    };


    constructor(public smsService: SmsService) {
    }

    ngOnInit() {
        this.orderedEventNames.forEach(event => {
            event['expansionPanelState'] = {  // for saving expansion panel closed or open state  after load
                eventPanel: false,
                notificationPanel: false,
                smsPanel: false,
            };
        });

        this.serviceAdapter = new CommonSettingsServiceAdapterComponent();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new CommonSettingsHtmlRendererComponent();
        this.htmlRenderer.initializeAdapter(this);
    }

    handleOnLoading(value: boolean): void {
        this.stateKeeper.isLoading = value;
        this.isLoading.emit(value);
    }

    isDefaultSelected(smsEvent: any): boolean {
        return smsEvent.selectedSMSId.id == this.populatedSMSIdList.find(smsId => smsId.smsId == 'Default').id;
    }
}
