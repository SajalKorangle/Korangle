import {SmsEventSettingsComponent} from '@modules/sms/pages/sms-event-settings/sms-event-settings.component';

export class SmsEventSettingsServiceAdapter {

    vm: SmsEventSettingsComponent;

    constructor() {
    }

    initialize(vm: SmsEventSettingsComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.stateKeeper.isLoading = true;
        let smsIdSchoolData = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        this.vm.backendData.SMSIdSchoolList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id_school, smsIdSchoolData);

        let smsIdData = {
            'id__in': this.vm.backendData.SMSIdSchoolList.map((a) => a.parentSMSId).join(),
        };
        this.vm.backendData.SMSIdList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id, smsIdData);

        this.vm.backendData.smsEventList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event, {'korangle__order': 'id'});

        this.vm.stateKeeper.isLoading = false;
    }

    async initializeEventSettings(eventPage: any) {
        this.vm.stateKeeper.isLoading = true;
        this.vm.userInput.selectedPage = eventPage;

        if (this.vm.previousPage && this.vm.previousPage.name == eventPage.name) {
            this.vm.stateKeeper.isLoading = false;
            return;
        }

        this.vm.backendData.selectedPageSMSEventList = this.vm.backendData.smsEventList.filter(a => a.eventName.includes(eventPage.name));

        let eventSettingsData = {
            'parentSMSEvent__in': this.vm.backendData.selectedPageSMSEventList.map(a => a.id).join(),
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        this.vm.backendData.selectedPageEventSettingsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, eventSettingsData);

        if (!this.vm.htmlRenderer.isGeneralOrDefaulters() &&
            this.vm.backendData.selectedPageEventSettingsList.length < this.vm.backendData.selectedPageSMSEventList.length) {
            this.vm.backendData.selectedPageSMSEventList.forEach(smsEvent => {
                let setting = this.vm.backendData.selectedPageEventSettingsList.find(set => set.parentSMSEvent == smsEvent.id);
                if (!setting) {
                    let tempSettings = {
                        'parentSMSEvent': smsEvent.id,
                        'parentSchool': this.vm.user.activeSchool.dbId,
                        'parentSentUpdateType': 1, //NULL
                        'parentSMSTemplate': null,
                        'receiverType': null,
                    };
                    this.vm.backendData.selectedPageEventSettingsList.push(tempSettings);
                }
            });
        }

        let templateData = {
            'id__in': this.vm.backendData.selectedPageEventSettingsList.map(a => a.parentSMSTemplate).join(),
        };
        this.vm.backendData.selectedPageTemplateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_template, templateData);

        this.vm.backendData.selectedPageTemplateList = this.vm.backendData.selectedPageTemplateList.
            // @ts-ignore
            sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        if (this.vm.htmlRenderer.isGeneralOrDefaulters()) {
            this.vm.htmlRenderer.initializeNewTemplate();
        } else {
            this.vm.populatedSMSIdList = JSON.parse(JSON.stringify(this.vm.backendData.SMSIdList));
            this.vm.populatedSMSIdList.push({id: 0, smsId: 'Default'});
            this.populateSMSEventSettings();
        }
        this.vm.stateKeeper.isLoading = false;
    }

    populateSMSEventSettings() {
        this.vm.userInput.populatedSMSEventSettingsList = [];
        this.vm.userInput.selectedPage.orderedEvents.forEach(eventName => {
            let temp = this.vm.backendData.smsEventList.find(smsEvent => smsEvent.eventName == eventName);
            temp['eventSettings'] = this.vm.backendData.selectedPageEventSettingsList.find(setting => setting.parentSMSEvent == temp.id);
            temp['customEventTemplate'] = this.vm.backendData.selectedPageTemplateList.find(template => template.id == temp['eventSettings'].parentSMSTemplate);
            if (temp['customEventTemplate']) {
                temp['selectedSMSId'] = this.vm.populatedSMSIdList.find(smsId => smsId.id == temp['customEventTemplate'].parentSMSId);
            } else {
                temp['selectedSMSId'] = this.vm.populatedSMSIdList.find(smsId => smsId.smsId == 'Default');
                temp['customEventTemplate'] = {templateId: '', templateName: '', communicationType: '', rawContent: '', mappedContent: ''};
            }
            temp['expansionPanelState'] = {  // for saving expansion panel closed or open state  after load
                eventPanel: false,
                notificationPanel: false,
                smsPanel: false,
            };
            this.vm.userInput.populatedSMSEventSettingsList.push(temp);
        });
        this.vm.populatedSMSEventSettingsList = JSON.parse(JSON.stringify(this.vm.userInput.populatedSMSEventSettingsList));
    }

    async addNewTemplate() {
        this.vm.stateKeeper.isLoading = true;
        const value = await this.vm.smsService.createObject(this.vm.smsService.sms_template, this.vm.userInput.newTemplate);
        this.vm.backendData.selectedPageTemplateList.push(value);
        let settings_data = {
            parentSMSEvent: this.vm.backendData.selectedPageSMSEventList[0].id,
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSMSTemplate: value.id,
        };
        const secondValue = await this.vm.smsService.createObject(this.vm.smsService.sms_event_settings, settings_data);
        this.vm.backendData.selectedPageEventSettingsList.push(secondValue);
        this.vm.htmlRenderer.initializeNewTemplate();
        this.vm.stateKeeper.isLoading = false;
    }

    async deleteTemplate(template: any) {
        if (confirm('Are you sure want to delete this Template?')) {
            this.vm.stateKeeper.isLoading = true;
            let setting = this.vm.backendData.selectedPageEventSettingsList.find(a => a.parentSMSTemplate == template.id);
            const value = await this.vm.smsService.deleteObject(this.vm.smsService.sms_event_settings, {id: setting.id});
            this.vm.backendData.selectedPageEventSettingsList = this.vm.backendData.selectedPageEventSettingsList.filter(a => a.id != setting.id);
            const secondValue = await this.vm.smsService.deleteObject(this.vm.smsService.sms_template, {id: template.id});
            this.vm.backendData.selectedPageTemplateList = this.vm.backendData.selectedPageTemplateList.filter(a => a.id != template.id);
            this.vm.stateKeeper.isLoading = false;
        }
    }

    async updateSettings(smsEvent: any) {
        this.vm.stateKeeper.isLoading = true;
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
            this.vm.backendData.selectedPageTemplateList.push(templateValue);
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
        this.vm.stateKeeper.isLoading = false;
    }
}
