import { Query } from '@services/generic/query';
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

        this.vm.backendData.SMSIdSchoolList = await new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ sms_app: 'SMSIdSchool' });
        this.vm.backendData.SMSIdList = await new Query()
            .filter({
                id__in: this.vm.backendData.SMSIdSchoolList.map((a) => a.parentSMSId),
                smsIdStatus: 'ACTIVATED',
            })
            .getObjectList({ sms_app: 'SMSId' });
        this.vm.backendData.eventList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event, {});
        this.vm.backendData.sendUpdateTypeList = await this.vm.informationService.getObjectList(this.vm.informationService.send_update_type, {});

        this.vm.stateKeeper.isLoading = false;
    }

    async initializeEventSettings(eventPage: any) {
        this.vm.stateKeeper.isLoading = true;
        this.vm.userInput.selectedPage = eventPage;
        this.vm.userInput.populatedSelectedPageEventsData = []; // Storing event data for all the events belonging to the selected page

        this.vm.backendData.selectedPageEventSettingsList = await new Query()
            .filter({
                SMSEventId__in: this.vm.userInput.selectedPage.orderedSMSEventIdList.map(id => id),
                parentSchool: this.vm.user.activeSchool.dbId,
            })
            .getObjectList({ sms_app: 'SMSEventSettings' });

        // Initializing event settings for those events which use default templates and for which event settings are not initilized yet
        this.vm.userInput.selectedPage.orderedSMSEventIdList.forEach(smsEventId => {
            if (!this.vm.htmlRenderer.isUserChosenTemplateForEvent(smsEventId)) {
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
        this.vm.backendData.selectedPageTemplateList = await new Query()
            .filter({
                id__in: this.vm.backendData.selectedPageEventSettingsList.map(a => a.parentSMSTemplate),
            })
            .orderBy('-id')
            .getObjectList({ sms_app: 'SMSTemplate' });

        // List of SMS id linked with the school
        this.vm.smsIdListFilteredBySchoolId = JSON.parse(JSON.stringify(this.vm.backendData.SMSIdList));
        this.vm.smsIdListFilteredBySchoolId.push({id: 0, smsId: 'Default'});

        // Populating neccessary information of each events of the seleceted page in populatedSelectedPageEventsData
        // [event info, event settings, default template info, custom template info, marking user chosen or default]
        let defaultTemplateIdList = []; // Storing default template ids for events in selected page to populate default templates later on
        this.vm.userInput.selectedPage.orderedSMSEventIdList.forEach(async smsEventId => {
            if (this.vm.htmlRenderer.isUserChosenTemplateForEvent(smsEventId)) {
                // If user chosen template then initializing new template and updating populatedSelectedPageEventsData
                this.vm.initializeNewTemplate();
                let temp = this.vm.backendData.eventList.find(x => x.id == smsEventId);
                temp.isUserChosenTemplateForEvent = true;
                this.vm.userInput.populatedSelectedPageEventsData.push(temp);
            }
            else {
                // if user has not chosen template for the event then storing default template ids and populating sms event setting further
                let defaultTemplateId = this.vm.backendData.eventList.filter(x => x.id == smsEventId).map(x => x.defaultSMSTemplateId);
                defaultTemplateIdList.push(defaultTemplateId);
                this.populateEventSettings(smsEventId);
            }
        });

        // Extracting Default templates list for the selected page
        this.vm.backendData.selectedPageDefaultTemplateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_default_template,
            {id__in: defaultTemplateIdList.join()});
        this.vm.populatedSelectedPageEventsData = JSON.parse(JSON.stringify(this.vm.userInput.populatedSelectedPageEventsData));
        this.vm.stateKeeper.isLoading = false;
    }

    populateEventSettings(eventId) {
        // Populating only if user has not chosen template for the event
        let temp = this.vm.backendData.eventList.find(x => x.id == eventId);
        temp['eventSettings'] = this.vm.backendData.selectedPageEventSettingsList.find(setting => setting.SMSEventId == temp.id);

        // If a template is linked with the SMS ID other than 'Default'
        temp['customEventTemplate'] = this.vm.backendData.selectedPageTemplateList.find(template => template.id == temp['eventSettings'].parentSMSTemplate);
        if (temp['customEventTemplate']) {
            temp['selectedSMSId'] = this.vm.smsIdListFilteredBySchoolId.find(smsId => smsId.id == temp['customEventTemplate'].parentSMSId);
        }
        else {
            temp['selectedSMSId'] = this.vm.smsIdListFilteredBySchoolId.find(smsId => smsId.id == 0);
            temp['customEventTemplate'] = {templateId: '', templateName: '', rawContent: '', mappedContent: '', parentSMSId: 0};
        }

        // for saving expansion panel closed or open state  after loading
        temp['expansionPanelState'] = {
            eventPanel: false,
            notificationPanel: false,
            smsPanel: false,
        };
        temp.isUserChosenTemplateForEvent = false;
        this.vm.userInput.populatedSelectedPageEventsData.push(temp);
    }

    async addNewTemplate() {
        this.vm.stateKeeper.isLoading = true;
        this.vm.userInput.newTemplate.rawContent = this.vm.userInput.newTemplate.rawContent.replace(/(\\r)?\\n/g, "\n");
        const value = await new Query().createObject({ sms_app: 'SMSTemplate' }, this.vm.userInput.newTemplate);
        this.vm.backendData.selectedPageTemplateList.push(value);
        this.vm.backendData.selectedPageTemplateList.sort((a, b) => {
            return b.id - a.id;
        });
        let settings_data = {
            SMSEventId: this.vm.userInput.selectedEvent.id,
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSMSTemplate: value.id,
        };
        const secondValue = await new Query().createObject({ sms_app: 'SMSEventSettings' }, settings_data);
        this.vm.backendData.selectedPageEventSettingsList.push(secondValue);
        this.vm.initializeNewTemplate();
        this.vm.stateKeeper.isLoading = false;
    }

    async deleteTemplate(template: any) {
        if (confirm('Are you sure want to delete this Template?')) {
            this.vm.stateKeeper.isLoading = true;
            let setting = this.vm.backendData.selectedPageEventSettingsList.find(a => a.parentSMSTemplate == template.id);
            const value = await new Query().filter({ id: setting.id }).deleteObjectList({ sms_app: 'SMSEventSettings' });
            this.vm.backendData.selectedPageEventSettingsList = this.vm.backendData.selectedPageEventSettingsList.filter(a => a.id != setting.id);
            const secondValue = await new Query().filter({ id: template.id }).deleteObjectList({ sms_app: 'SMSTemplate' });
            this.vm.backendData.selectedPageTemplateList = this.vm.backendData.selectedPageTemplateList.filter(a => a.id != template.id);
            this.vm.stateKeeper.isLoading = false;
        }
    }

    async updateSettings(smsEvent: any) {
        this.vm.stateKeeper.isLoading = true;
        if (!this.vm.isDefaultSelected(smsEvent)) {
            let templateValue;
            let originalTemplateData = this.vm.populatedSelectedPageEventsData.find(pop => pop.eventName == smsEvent.eventName);
            if (!smsEvent.customEventTemplate.id) {
                smsEvent.customEventTemplate.rawContent =  smsEvent.customEventTemplate.rawContent.replace(/(\\r)?\\n/g, "\n");
                templateValue = await new Query().createObject({ sms_app: 'SMSTemplate' }, smsEvent.customEventTemplate);
            } else if (JSON.stringify(smsEvent.customEventTemplate) != JSON.stringify(originalTemplateData.customEventTemplate)) {
                templateValue = await new Query().updateObject({ sms_app: 'SMSTemplate' }, smsEvent.customEventTemplate);
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
            value = await new Query().updateObject({ sms_app: 'SMSEventSettings' }, smsEvent.eventSettings);
        } else {
            value = await new Query().createObject({ sms_app: 'SMSEventSettings' }, smsEvent.eventSettings);
        }
        smsEvent.eventSettings = JSON.parse(JSON.stringify(value));

        Object.assign(
            this.vm.populatedSelectedPageEventsData.find((t) => t.id === smsEvent.id),
            JSON.parse(JSON.stringify(smsEvent))
        );
        this.vm.stateKeeper.isLoading = false;
    }
}
