import {SettingsComponent} from './settings.component';

export class SettingsServiceAdapter {
    vm: SettingsComponent;

    tutorialEventNames = ['Tutorial Creation', 'Tutorial Updation', 'Tutorial Deletion'];

    constructor() {
    }

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.stateKeeper.isLoading = true;
        let data = {
            'parentSchool': this.vm.user.activeSchool.dbId
        };
        const value = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id_school, data);

        let smsIdData = {
            'id__in': value.map((a) => a.parentSMSId).join(),
        };

        this.vm.backendData.smsIdList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id, smsIdData);
        this.vm.populatedSMSIdList = this.vm.backendData.smsIdList;
        this.vm.populatedSMSIdList.push({smsId: 'Default'});

        let data1 = {
            'eventName__in': this.tutorialEventNames,
        };
        this.vm.backendData.smsEventList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event, data1);

        let data2 = {
            'parentSMSEvent__in': this.vm.backendData.smsEventList.map((a) => a.id).join(),
            'parentSchool': this.vm.user.activeSchool.dbId,
        };
        this.vm.backendData.smsEventSettingsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, data2);

        let data3 = {
            'id__in': this.vm.backendData.smsEventSettingsList.map((a) => a.parentSMSTemplate).join(),
        };
        this.vm.backendData.customEventTemplateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_template, data3);

        this.populateSMSEventSettings();
        this.vm.stateKeeper.isLoading = false;
    }

    populateSMSEventSettings() {
        this.vm.backendData.smsEventSettingsList.forEach(setting => {
            let temp = this.vm.backendData.smsEventList.find(smsEvent => smsEvent.id == setting.parentSMSEvent);
            temp['eventSettings'] = setting;
            temp['customEventTemplate'] = this.vm.backendData.customEventTemplateList.find(temp => temp.id == temp.parentSMSTemplate);
            if (temp['customEventTemplate']) {
                temp['smsId'] = this.vm.populatedSMSIdList.find(smsId => smsId.id == temp['customEventTemplate'].id);
            } else {
                temp['smsId'] = {smsId: 'Default'};
                temp['customEventTemplate'] = {templateId: '', templateName: '', CommunicationType: '', rawContent: '', mappedContent: ''};
            }
            this.vm.userInput.populatedSMSEventSettingsList.push(temp);
        });
        this.vm.populatedSMSEventSettingsList = JSON.parse(JSON.stringify(this.vm.userInput.populatedSMSEventSettingsList));
    }

    async updateSettings(eventNameUser: any) {
        this.vm.stateKeeper.isLoading = true;
        let parentTemplateId = 0;
        if (eventNameUser.smsId.smsId != 'Default' && !eventNameUser.customEventTemplate.id) {
            const value = await this.vm.smsService.createObject(this.vm.smsService.sms_template, eventNameUser.customEventTemplate);
            eventNameUser.customEventTemplate = value;
            this.vm.backendData.customEventTemplateList.push(value);
            parentTemplateId = value.id;
        }
        eventNameUser.eventSettings.parentSMSTemplate = parentTemplateId;
        const value = await this.vm.smsService.updateObject(this.vm.smsService.sms_event_settings, eventNameUser);
        Object.assign(
            this.vm.populatedSMSEventSettingsList.find((t) => t.id === value.id),
            JSON.parse(JSON.stringify(value))
        );
        this.vm.stateKeeper.isLoading = false;
    }


}
