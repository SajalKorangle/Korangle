import {ManageDefaultersTemplateComponent} from './manage-defaulters-template.component';

export class ManageDefaultersTemplateServiceAdapter {

    vm: ManageDefaultersTemplateComponent;

    constructor() {
    }

    initialize(vm: ManageDefaultersTemplateComponent): void {
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

        this.vm.backendData.defaultersSMSEvent = await this.vm.smsService.getObject(this.vm.smsService.sms_event, {eventName: 'Notify Defaulters'});

        let eventSettingsData = {
            'parentSMSEvent': this.vm.backendData.defaultersSMSEvent.id,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        this.vm.backendData.eventSettingsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, eventSettingsData);

        let templateData = {
            'id__in': this.vm.backendData.eventSettingsList.map(a => a.parentSMSTemplate).join(),
        };
        this.vm.backendData.templateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_template, templateData);
        // @ts-ignore
        this.vm.backendData.templateList = this.vm.backendData.templateList.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        this.vm.htmlRenderer.initializeNewTemplate();
        this.vm.stateKeeper.isLoading = false;
    }

    async addNewTemplate() {
        this.vm.stateKeeper.isLoading = true;
        const value = await this.vm.smsService.createObject(this.vm.smsService.sms_template, this.vm.userInput.newTemplate);
        this.vm.backendData.templateList.push(value);
        let settings_data = {
            parentSMSEvent: this.vm.backendData.defaultersSMSEvent.id,
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSMSTemplate: value.id,
        };
        const secondValue = await this.vm.smsService.createObject(this.vm.smsService.sms_event_settings, settings_data);
        this.vm.backendData.eventSettingsList.push(secondValue);
        this.vm.htmlRenderer.initializeNewTemplate();
        this.vm.stateKeeper.isLoading = false;
    }

    async deleteTemplate(template: any) {
        if (confirm('Are you sure want to delete this Template?')) {
            this.vm.stateKeeper.isLoading = true;
            let setting = this.vm.backendData.eventSettingsList.find(a => a.parentSMSTemplate == template.id);
            const value = await this.vm.smsService.deleteObject(this.vm.smsService.sms_event_settings, {id: setting.id});
            this.vm.backendData.eventSettingsList = this.vm.backendData.eventSettingsList.filter(a => a.id != setting.id);
            const secondValue = await this.vm.smsService.deleteObject(this.vm.smsService.sms_template, {id: template.id});
            this.vm.backendData.templateList = this.vm.backendData.templateList.filter(a => a.id != template.id);
            this.vm.stateKeeper.isLoading = false;
        }
    }

}
