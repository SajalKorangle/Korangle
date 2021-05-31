import {CommonSettingsComponent} from '@modules/module-components/common-settings/common-settings.component';

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
        console.log(this.vm.backendData.smsEventSettingsList);
        if (this.vm.backendData.smsEventSettingsList.length < this.vm.orderedEventNames.length) {
            this.vm.backendData.smsEventList.forEach(smsEvent => {
                let setting = this.vm.backendData.smsEventSettingsList.find(set => set.parentSMSEvent == smsEvent.id);
                if (!setting) {
                    let tempSettings = {
                        'parentSMSEvent': smsEvent.id,
                        'parentSchool': this.vm.user.activeSchool.dbId,
                        'parentSentUpdateType': 1, //NULL
                        'parentSMSTemplate': null,
                        'receiverType': null,
                    };
                    this.vm.backendData.smsEventSettingsList.push(tempSettings);
                }
            });
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
        if (!this.vm.isDefaultSelected(smsEvent)) {
            let templateValue;
            if (!smsEvent.customEventTemplate.id) {
                templateValue = await this.vm.smsService.createObject(this.vm.smsService.sms_template, smsEvent.customEventTemplate);
                parentTemplateId = templateValue.id;
            } else {
                templateValue = await this.vm.smsService.updateObject(this.vm.smsService.sms_template, smsEvent.customEventTemplate);
            }
            smsEvent.customEventTemplate = JSON.parse(JSON.stringify(templateValue));
            this.vm.backendData.customEventTemplateList.push(templateValue);
        }
        smsEvent.eventSettings.parentSMSTemplate = parentTemplateId;

        let value;
        if (smsEvent.eventSettings.id) { // checking whether it already has a dbId or creating a new setting
            value = await this.vm.smsService.updateObject(this.vm.smsService.sms_event_settings, smsEvent.eventSettings);
        } else {
            value = await this.vm.smsService.createObject(this.vm.smsService.sms_event_settings, smsEvent.eventSettings);
        }
        smsEvent.eventSettings = JSON.parse(JSON.stringify(value));

        Object.assign(
            this.vm.populatedSMSEventSettingsList.find((t) => t.id === smsEvent.id),
            JSON.parse(JSON.stringify(smsEvent))
        );
        this.vm.handleOnLoading(false);
    }

}
