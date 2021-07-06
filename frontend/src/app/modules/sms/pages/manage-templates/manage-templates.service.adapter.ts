import {ManageTemplatesComponent} from '@modules/sms/pages/manage-templates/manage-templates.component';

export class ManageTemplatesServiceAdapter {

    vm: ManageTemplatesComponent;

    constructor() {
    }

    initialize(vm: ManageTemplatesComponent): void {
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
            'smsIdStatus': 'ACTIVATED',
        };
        this.vm.backendData.SMSIdList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id, smsIdData);

        this.vm.stateKeeper.isLoading = false;
    }

    async initializeEventSettings(eventPage: any) {
        this.vm.stateKeeper.isLoading = true;
        this.vm.userInput.selectedPage = eventPage;

        let eventSettingsData = {
            'SMSEventFrontEndId__in': this.vm.userInput.selectedPage.orderedSMSEventList.map(a => a.id).join(),
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        this.vm.backendData.selectedPageEventSettingsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, eventSettingsData);

        if (!this.vm.htmlRenderer.isGeneralOrDefaulters() &&
            this.vm.backendData.selectedPageEventSettingsList.length < this.vm.userInput.selectedPage.orderedSMSEventList.length) {
            this.vm.userInput.selectedPage.orderedSMSEventList.forEach(smsEvent => {
                let setting = this.vm.backendData.selectedPageEventSettingsList.find(set => set.SMSEventFrontEndId == smsEvent.id);
                if (!setting) {
                    let tempSettings = {
                        'SMSEventFrontEndId': smsEvent.id,
                        'parentSchool': this.vm.user.activeSchool.dbId,
                        'sendUpdateTypeFrontEndId': 1, //NULL
                        'parentSMSTemplate': null,
                        'receiverType': null,
                    };
                    this.vm.backendData.selectedPageEventSettingsList.push(tempSettings);
                }
            });
        }

        let templateData = {
            'id__in': this.vm.backendData.selectedPageEventSettingsList.map(a => a.parentSMSTemplate).join(),
            'korangle__order': '-id',
        };
        this.vm.backendData.selectedPageTemplateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_template, templateData);

        if (this.vm.htmlRenderer.isGeneralOrDefaulters()) {
            this.vm.htmlRenderer.initializeNewTemplate();
            if (this.vm.userInput.selectedPage.orderedSMSEventList.length == 1) {
                this.vm.userInput.selectedEvent = this.vm.userInput.selectedPage.orderedSMSEventList[0];
            }
        } else {
            this.vm.populatedSMSIdList = JSON.parse(JSON.stringify(this.vm.backendData.SMSIdList));
            this.vm.populatedSMSIdList.push({id: 0, smsId: 'Default'});
            this.populateSMSEventSettings();
        }
        this.vm.stateKeeper.isLoading = false;
    }

    populateSMSEventSettings() {
        this.vm.userInput.populatedSMSEventSettingsList = [];
        this.vm.userInput.selectedPage.orderedSMSEventList.forEach(event => {
            let temp = event;
            temp['eventSettings'] = this.vm.backendData.selectedPageEventSettingsList.find(setting => setting.SMSEventFrontEndId == temp.id);
            temp['customEventTemplate'] = this.vm.backendData.selectedPageTemplateList.find(template => template.id == temp['eventSettings'].parentSMSTemplate);
            if (temp['customEventTemplate']) {
                temp['selectedSMSId'] = this.vm.populatedSMSIdList.find(smsId => smsId.id == temp['customEventTemplate'].parentSMSId);
            } else {
                temp['selectedSMSId'] = this.vm.populatedSMSIdList.find(smsId => smsId.id == 0);
                temp['customEventTemplate'] = {templateId: '', templateName: '', rawContent: '', mappedContent: '', parentSMSId: 0};
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
        this.vm.userInput.newTemplate.rawContent = this.vm.userInput.newTemplate.rawContent.replace(/(\\r)?\\n/g, "\n");
        const value = await this.vm.smsService.createObject(this.vm.smsService.sms_template, this.vm.userInput.newTemplate);
        this.vm.backendData.selectedPageTemplateList.push(value);
        this.vm.backendData.selectedPageTemplateList.sort((a, b) => {
            return b.id - a.id;
        });
        let settings_data = {
            SMSEventFrontEndId: this.vm.userInput.selectedPage.orderedSMSEventList.find(x => x.id == this.vm.userInput.selectedEvent.id).id,
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
        if (!this.vm.isDefaultSelected(smsEvent)) {
            let templateValue;
            let originalTemplateData = this.vm.populatedSMSEventSettingsList.find(pop => pop.eventName == smsEvent.eventName);
            if (!smsEvent.customEventTemplate.id) {
                smsEvent.customEventTemplate.rawContent =  smsEvent.customEventTemplate.rawContent.replace(/(\\r)?\\n/g, "\n");
                templateValue = await this.vm.smsService.createObject(this.vm.smsService.sms_template, smsEvent.customEventTemplate);
            } else if (JSON.stringify(smsEvent.customEventTemplate) != JSON.stringify(originalTemplateData.customEventTemplate)) {
                templateValue = await this.vm.smsService.updateObject(this.vm.smsService.sms_template, smsEvent.customEventTemplate);
            }
            if (templateValue) {
                smsEvent.eventSettings.parentSMSTemplate = templateValue.id;
                smsEvent.customEventTemplate = JSON.parse(JSON.stringify(templateValue));
                this.vm.backendData.selectedPageTemplateList.push(templateValue);
            }
        } else {
            smsEvent.eventSettings.parentSMSTemplate = null;
        }

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
