import {CommonSettingsComponent} from '@components/common-settings/common-settings.component';

export class CommonSettingsServiceAdapterComponent {
    vm: CommonSettingsComponent;


    constructor() {
    }

    initializeAdapter(vm: CommonSettingsComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.handleOnLoading(true);
        let smsIdSchoolData = {
            'parentSchool': this.vm.user.activeSchool.dbId
        };
        const value = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id_school, smsIdSchoolData);

        let smsIdData = {
            'id__in': value.map((a) => a.parentSMSId).join(),
        };

        this.vm.backendData.smsIdList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id, smsIdData);
        this.vm.populatedSMSIdList = this.vm.backendData.smsIdList;
        this.vm.populatedSMSIdList.push({id: 0, smsId: 'Default'});

        let smsEventData = {
            'eventName__in': this.vm.orderedEventNames.map(a => a.name).join(),
        };
        this.vm.backendData.smsEventList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event, smsEventData);

        let smsEventSettingsData = {
            'parentSMSEvent__in': this.vm.backendData.smsEventList.map((a) => a.id).join(),
            'parentSchool': this.vm.user.activeSchool.dbId,
        };
        this.vm.backendData.smsEventSettingsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, smsEventSettingsData);

        if (!this.vm.backendData.smsEventSettingsList) {
            let smsEventSettingsCreatingData = [];
            this.vm.orderedEventNames.forEach(eventName => {
                let temp = {
                    'parentSMSEvent': this.vm.backendData.smsEventList.find(event => event.eventName == eventName.name),
                    'parentSchool': this.vm.user.activeSchool.dbId,
                    'parentSentUpdateType': 1 //NULL
                };
                smsEventSettingsCreatingData.push(temp);
            });
            this.vm.backendData.smsEventSettingsList = await this.vm.smsService.createObjectList(this.vm.smsService.sms_event_settings, smsEventSettingsData);
            console.log(this.vm.backendData.smsEventSettingsList);
        }

        let smsTemplateData = {
            'id__in': this.vm.backendData.smsEventSettingsList.map((a) => a.parentSMSTemplate).join(),
        };
        this.vm.backendData.customEventTemplateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_template, smsTemplateData);

        this.populateSMSEventSettings();
        this.vm.handleOnLoading(false);
    }

    populateSMSEventSettings() {
        this.vm.orderedEventNames.forEach(eventNames => {
            let temp = this.vm.backendData.smsEventList.find(smsEvent => smsEvent.eventName == eventNames.name);
            temp['eventSettings'] = this.vm.backendData.smsEventSettingsList.find(setting => setting.parentSMSEvent == temp.id);
            temp['customEventTemplate'] = this.vm.backendData.customEventTemplateList.find(template => template.id == temp['eventSettings'].parentSMSTemplate);
            console.log(temp['customEventTemplate']);
            if (temp['customEventTemplate']) {
                temp['selectedSMSId'] = this.vm.populatedSMSIdList.find(smsId => smsId.id == temp['customEventTemplate'].parentSMSId);
            } else {
                temp['selectedSMSId'] = this.vm.populatedSMSIdList.find(smsId => smsId.smsId == 'Default');
                temp['customEventTemplate'] = {templateId: '', templateName: '', communicationType: '', rawContent: '', mappedContent: ''};
            }
            this.vm.userInput.populatedSMSEventSettingsList.push(temp);
            console.log(temp);
        });
        this.vm.populatedSMSEventSettingsList = JSON.parse(JSON.stringify(this.vm.userInput.populatedSMSEventSettingsList));
    }

    async updateSettings(smsEvent: any) {
        this.vm.handleOnLoading(true);
        let parentTemplateId = null;
        if (smsEvent.selectedSMSId.smsId != 'Default' && !smsEvent.customEventTemplate.id) {
            const value1 = await this.vm.smsService.createObject(this.vm.smsService.sms_template, smsEvent.customEventTemplate);
            smsEvent.customEventTemplate = JSON.parse(JSON.stringify(value1));
            this.vm.backendData.customEventTemplateList.push(value1);
            parentTemplateId = value1.id;
        }
        smsEvent.eventSettings.parentSMSTemplate = parentTemplateId;
        const value = await this.vm.smsService.updateObject(this.vm.smsService.sms_event_settings, smsEvent.eventSettings);
        smsEvent.eventSettings = JSON.parse(JSON.stringify(value));
        Object.assign(
            this.vm.populatedSMSEventSettingsList.find((t) => t.eventSettings.id === value.id),
            JSON.parse(JSON.stringify(smsEvent))
        );
        this.vm.handleOnLoading(false);
    }

}
