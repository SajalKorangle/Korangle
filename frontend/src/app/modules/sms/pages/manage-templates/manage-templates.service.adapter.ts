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
        this.vm.backendData.sendUpdateTypeList = await this.vm.informationService.getObjectList(this.vm.informationService.send_update_type, {});
        this.vm.backendData.SMSEventList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event, {});
        this.vm.stateKeeper.isLoading = false;
    }

    async initializeEventSettings(eventPage: any) {
        this.vm.stateKeeper.isLoading = true;
        this.vm.userInput.selectedPage = eventPage;
        this.vm.userInput.populatedSMSEventSettingsList = []; // Storing event settings for all the events belonging to the selected page

        let eventSettingsData = {
            'SMSEventId__in': this.vm.userInput.selectedPage.orderedSMSEventIdList.map(id => id).join(),
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        this.vm.backendData.selectedPageEventSettingsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, eventSettingsData);

        // Initializing event settings for those events which use default templates and for which event settings are not initilized yet
        this.vm.userInput.selectedPage.orderedSMSEventIdList.forEach(smsEventId => {
            if(!this.vm.htmlRenderer.isUserChosenTemplateForEvent(smsEventId)) {
                let setting = this.vm.backendData.selectedPageEventSettingsList.find(set => set.SMSEventId == smsEventId);
                if (!setting) {
                    let tempSettings = {
                        'SMSEventId': smsEventId,
                        'parentSchool': this.vm.user.activeSchool.dbId,
                        'sendUpdateTypeId': 1, //NULL
                        'parentSMSTemplate': null,
                        'receiverType': null,
                    };
                    this.vm.backendData.selectedPageEventSettingsList.push(tempSettings);
                }
            }
        });

        // Extracting templates list for the selected page
        let templateData = {
            'id__in': this.vm.backendData.selectedPageEventSettingsList.map(a => a.parentSMSTemplate).join(),
            'korangle__order': '-id',
        };
        this.vm.backendData.selectedPageTemplateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_template, templateData);

        // Populating SMS ID list
        this.vm.populatedSMSIdList = JSON.parse(JSON.stringify(this.vm.backendData.SMSIdList));
        this.vm.populatedSMSIdList.push({id: 0, smsId: 'Default'});

        // Populating neccessary information of each events of the seleceted page in populatedSMSEventSettingsList
        // [event info, event settings, default template info, custom template info, marking user chosen or default]
        let defaultTemplateIdList = [] // Storing default template ids for events in selected page to populate default templates later on
        this.vm.userInput.selectedPage.orderedSMSEventIdList.forEach(async smsEventId => {
            if(this.vm.htmlRenderer.isUserChosenTemplateForEvent(smsEventId)) {
                // If user chosen template then initializing new template and updating populatedSMSEventSettingsList
                this.vm.htmlRenderer.initializeNewTemplate();
                let temp = this.vm.backendData.SMSEventList.find(x => x.id == smsEventId);
                temp.isUserChosenTemplateForEvent = true;           
                this.vm.userInput.populatedSMSEventSettingsList.push(temp);
            }
            else {
                // if user has not chosen template for the event then storing default template ids and populating sms event setting further
                let defaultTemplateId = this.vm.backendData.SMSEventList.filter(x => x.id == smsEventId).map(x => x.defaultSMSTemplateId);
                defaultTemplateIdList.push(defaultTemplateId);
                this.populateSMSEventSettings(smsEventId);
            }
        });

        // Extracting Default templates list for the selected page
        let defaultTemplateIdListString = defaultTemplateIdList.join();
        this.vm.backendData.selectedPageDefaultTemplateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_default_template,
            {id__in: defaultTemplateIdListString});
        this.vm.populatedSMSEventSettingsList = JSON.parse(JSON.stringify(this.vm.userInput.populatedSMSEventSettingsList));
        this.vm.stateKeeper.isLoading = false;
    }

    populateSMSEventSettings(eventId) {
        // Populating only if user has not chosen template for the event        
        let temp = this.vm.backendData.SMSEventList.find(x => x.id == eventId);
        temp['eventSettings'] = this.vm.backendData.selectedPageEventSettingsList.find(setting => setting.SMSEventId == temp.id);
        
        // If custom template is linked with the event
        temp['customEventTemplate'] = this.vm.backendData.selectedPageTemplateList.find(template => template.id == temp['eventSettings'].parentSMSTemplate);
        if (temp['customEventTemplate']) {
            temp['selectedSMSId'] = this.vm.populatedSMSIdList.find(smsId => smsId.id == temp['customEventTemplate'].parentSMSId);
        }
        else {
            temp['selectedSMSId'] = this.vm.populatedSMSIdList.find(smsId => smsId.id == 0);
            temp['customEventTemplate'] = {templateId: '', templateName: '', rawContent: '', mappedContent: '', parentSMSId: 0};
        }
        
        // for saving expansion panel closed or open state  after loading
        temp['expansionPanelState'] = {
            eventPanel: false,
            notificationPanel: false,
            smsPanel: false,
        };
        temp.isUserChosenTemplateForEvent = false;
        this.vm.userInput.populatedSMSEventSettingsList.push(temp);
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
            SMSEventId: this.vm.userInput.selectedEvent.id,
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
