import {SmsEventSettingsComponent} from '@modules/sms/pages/sms-event-settings/sms-event-settings.component';
import {isMobile} from '@classes/common';

export class SmsEventSettingsHtmlRenderer {

    vm: SmsEventSettingsComponent;

    constructor() {
    }

    initialize(vm: SmsEventSettingsComponent): void {
        this.vm = vm;
    }

    initializeNewTemplate() {
        this.vm.userInput.newTemplate = {
            parentSMSId: null,
            templateId: null,
            templateName: null,
            rawContent: null,
            communicationType: null,
            mappedContent: null,
        };
    }

    isAddDisabled() {
        return !this.vm.userInput.newTemplate.templateId || this.vm.userInput.newTemplate.templateId.trim() == '' ||
            !this.vm.userInput.newTemplate.templateName || this.vm.userInput.newTemplate.templateName.trim() == '' ||
            !this.vm.userInput.newTemplate.rawContent || this.vm.userInput.newTemplate.rawContent.trim() == '' ||
            !this.vm.userInput.newTemplate.communicationType || this.vm.userInput.newTemplate.communicationType.trim() == '';
    }

    getTemplateShortContent(content: any) {
        return content.length > 50 ? content.substring(0, 50) + '....' : content;
    }

    getFilteredTemplateList() {
        let returnData = this.vm.backendData.selectedPageTemplateList;
        if (this.vm.userInput.selectedTemplateStatus && this.vm.userInput.selectedTemplateStatus != 'ALL') {
            returnData = returnData.filter(temp => temp.registrationStatus == this.vm.userInput.selectedTemplateStatus);
        }
        if (this.vm.userInput.startDate) {
            returnData = returnData.filter(temp => new Date(temp.createdDate) >= new Date(this.vm.userInput.startDate));
        }
        if (this.vm.userInput.endDate) {
            returnData = returnData.filter(temp => new Date(temp.createdDate) <= new Date(this.vm.userInput.endDate));
        }
        return returnData;
    }

    getReceiptColumnFilterKeys(): any {
        return Object.keys(this.vm.columnFilter);
    }

    isMobile() {
        return isMobile();
    }

    getTemplateSMSId(template: any) {
        return this.vm.backendData.SMSIdList.find(smsId => smsId.id == template.parentSMSId).smsId;
    }

    isGeneralOrDefaulters(): boolean {
        return this.vm.backendData.selectedPageSMSEventList[0].id == 1 || this.vm.backendData.selectedPageSMSEventList[0].id == 2;
    }

    isUpdateDisabled(smsEvent: any) {
        let originalData = this.vm.populatedSMSEventSettingsList.find(pop => pop.eventName == smsEvent.eventName);
        if (JSON.stringify(smsEvent.eventSettings) == JSON.stringify(originalData.eventSettings) &&
            JSON.stringify(smsEvent.customEventTemplate) == JSON.stringify(originalData.customEventTemplate) &&
            smsEvent.selectedSMSId.id == originalData.selectedSMSId.id) {
            return true;
        }
        if (!this.vm.isDefaultSelected(smsEvent)) {
            if (!smsEvent.customEventTemplate.rawContent || smsEvent.customEventTemplate.rawContent.trim() == '' ||
                !smsEvent.customEventTemplate.templateId || smsEvent.customEventTemplate.templateId.trim() == '' ||
                !smsEvent.customEventTemplate.templateName || smsEvent.customEventTemplate.templateName.trim() == '' ||
                !smsEvent.customEventTemplate.mappedContent || smsEvent.customEventTemplate.mappedContent.trim() == '' ||
                !smsEvent.customEventTemplate.communicationType || smsEvent.customEventTemplate.communicationType.trim() == '') {
                return true;
            }
        }
        return this.isTemplateModified(smsEvent);
    }

    getUpdateType(smsEvent: any) {
        return this.vm.backendData.sentUpdateList.find(type => type.id == smsEvent.eventSettings.parentSentUpdateType);
    }

    setUpdateType(smsEvent: any, selectedType: any) {
        smsEvent.eventSettings.parentSentUpdateType = selectedType.id;
    }

    getNotificationContent(smsEvent: any) {
        if (smsEvent.eventSettings.customNotificationContent &&
            smsEvent.eventSettings.customNotificationContent.trim() == smsEvent.defaultNotificationContent) {
            smsEvent.eventSettings.customNotificationContent = null;
        }
        return smsEvent.eventSettings.customNotificationContent ? smsEvent.eventSettings.customNotificationContent : smsEvent.defaultNotificationContent;
    }

    setNotificationContent(smsEvent: any, $event: any) {
        smsEvent.eventSettings.customNotificationContent = $event;
    }

    setSMSIdSelection(smsEvent: any, $event: any) {
        let template = this.vm.backendData.selectedPageTemplateList.find(temp => temp.parentSMSId == $event.Id);
        if (template) {
            smsEvent.eventSettings.parentSMSTemplate = template.id;
            smsEvent.customEventTemplate = template;
        }
        smsEvent.selectedSMSId = $event;
        smsEvent.customEventTemplate.parentSMSId = $event.id;
    }

    getMappedContent(smsEvent) {
        if (this.vm.isDefaultSelected(smsEvent)) {
            return smsEvent.defaultSMSContent;
        }
        return smsEvent.customEventTemplate.mappedContent;
    }

    rawContentChanged(smsEvent: any, $event: any) {
        smsEvent.customEventTemplate.rawContent = $event;
        smsEvent.customEventTemplate.mappedContent = smsEvent.customEventTemplate.rawContent.replace(/{#var#}/g, '@studentName');
    }

    getExpandedState(panelName: string, smsEvent: any) {
        let tutorialEvent = this.vm.userInput.populatedSMSEventSettingsList.find(event => event.id == smsEvent.id);
        return tutorialEvent.expansionPanelState[panelName];
    }

    setExpandedState(panelName: string, smsEvent: any, panelEvent: any) {
        let event = this.vm.userInput.populatedSMSEventSettingsList.find(event => event.id == smsEvent.id);
        event.expansionPanelState[panelName] = panelEvent;
        // when closing the event panel the child panels should also close
        if (panelName == this.vm.panelsList[0] && panelEvent == false) {
            event.expansionPanelState.notificationPanel = false;
            event.expansionPanelState.smsPanel = false;
        }
    }

    setMappedContent(smsEvent: any, $event: any) {
        if (!this.vm.isDefaultSelected(smsEvent)) {
            smsEvent.customEventTemplate.mappedContent = $event;
        }
    }

    isTemplateModified(smsEvent: any) {
        return !this.vm.isDefaultSelected(smsEvent) &&
            smsEvent.customEventTemplate.mappedContent.replace(this.vm.variableRegex, '{#var#}') != smsEvent.customEventTemplate.rawContent;
    }

}
