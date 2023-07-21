import {ManageTemplatesComponent} from '@modules/sms/pages/manage-templates/manage-templates.component';
import {isMobile} from '@classes/common';
import {FIND_VARIABLE_REGEX, VARIABLE_MAPPED_EVENT_LIST} from '@modules/classes/constants';

export class ManageTemplatesHtmlRenderer {

    vm: ManageTemplatesComponent;
    generalAndDefaulterEventIdList = [1, 2, 3, 4];

    constructor() {
    }

    initialize(vm: ManageTemplatesComponent): void {
        this.vm = vm;
    }

    isAddDisabled() {
        return !this.vm.userInput.newTemplate.templateId || this.vm.userInput.newTemplate.templateId.trim() == '' ||
            !this.vm.userInput.newTemplate.templateName || this.vm.userInput.newTemplate.templateName.trim() == '' ||
            !this.vm.userInput.newTemplate.rawContent || this.vm.userInput.newTemplate.rawContent.trim() == '' ||
            !this.vm.userInput.newTemplate.parentSMSId;
    }

    getTemplateShortContent(content: any) {
        return content.length > 50 ? content.substring(0, 50) + '....' : content;
    }

    getFilteredTemplateList() {
        let returnData = this.getSelectedEventTemplateList();
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
        let backendTemplate = this.vm.backendData.SMSIdList.find(smsId => smsId.id == template.parentSMSId);
        if (backendTemplate) return backendTemplate.smsId;
        return null;
    }

    isUserChosenTemplateForEvent(smsEventId: any): boolean {
        // To check whether ther user is using his/her own template or a default template for the event
        return this.generalAndDefaulterEventIdList.includes(smsEventId);
    }

    isUpdateDisabled(smsEvent: any) {
        let originalData = this.vm.populatedSelectedPageEventsData.find(pop => pop.eventName == smsEvent.eventName);
        if (JSON.stringify(smsEvent.eventSettings) == JSON.stringify(originalData.eventSettings) &&
            JSON.stringify(smsEvent.customEventTemplate) == JSON.stringify(originalData.customEventTemplate) &&
            smsEvent.selectedSMSId.id == originalData.selectedSMSId.id) {
            return true;
        }
        if (!this.vm.isDefaultSelected(smsEvent)) {
            if (!smsEvent.customEventTemplate.rawContent || smsEvent.customEventTemplate.rawContent.trim() == '' ||
                !smsEvent.customEventTemplate.templateId || smsEvent.customEventTemplate.templateId.trim() == '' ||
                !smsEvent.customEventTemplate.templateName || smsEvent.customEventTemplate.templateName.trim() == '' ||
                !smsEvent.customEventTemplate.mappedContent || smsEvent.customEventTemplate.mappedContent.trim() == '') {
                return true;
            }
            return this.isTemplateModified(smsEvent);
        }
        return false;
    }

    getUpdateType(smsEvent: any) {
        return this.vm.backendData.sendUpdateTypeList.find(type => type.id == smsEvent.eventSettings.sendUpdateTypeId);
    }

    setUpdateType(smsEvent: any, selectedType: any) {
        smsEvent.eventSettings.sendUpdateTypeId = selectedType.id;
    }

    getNotificationContent(smsEvent: any) {
        if (smsEvent.eventSettings.customNotificationContent &&
            smsEvent.eventSettings.customNotificationContent.trim() == smsEvent.defaultNotificationContent) {
            smsEvent.eventSettings.customNotificationContent = null;
        }
        return smsEvent.eventSettings.customNotificationContent ? smsEvent.eventSettings.customNotificationContent : smsEvent.defaultNotificationContent;
    }

    setNotificationContent(smsEvent: any, $event: any) {
        smsEvent.eventSettings.customNotificationContent = $event.replace(/(\\r)?\\n/g, '\n');
        let textArea = document.getElementById('notificationContent');
        textArea.style.height = '0px';
        textArea.style.height = (textArea.scrollHeight + 30) + 'px';
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
            return this.vm.backendData.selectedPageDefaultTemplateList.find(x => x.id == smsEvent.defaultSMSTemplateId).mappedContent;
        }
        return smsEvent.customEventTemplate.mappedContent;
    }

    rawContentChanged(smsEvent: any, $event: any) {
        smsEvent.customEventTemplate.rawContent = $event.replace(/(\\r)?\\n/g, '\n');
        smsEvent.customEventTemplate.mappedContent = smsEvent.customEventTemplate.rawContent.replace(/{#var#}/g, '{#studentName#}');
        let textArea = document.getElementById('smsTemplate');
        textArea.style.height = '0px';
        textArea.style.height = (textArea.scrollHeight + 30) + 'px';
    }

    getExpandedState(panelName: string, smsEvent: any) {
        let event = this.vm.userInput.populatedSelectedPageEventsData.find(event => event.id == smsEvent.id);
        return event.expansionPanelState[panelName];
    }

    setExpandedState(panelName: string, smsEvent: any, panelEvent: any) {
        let event = this.vm.userInput.populatedSelectedPageEventsData.find(event => event.id == smsEvent.id);
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
        let textArea = document.getElementById('mappedContent');
        textArea.style.height = '0px';
        textArea.style.height = (textArea.scrollHeight + 30) + 'px';
    }

    isTemplateModified(smsEvent: any) {
        return !this.vm.isDefaultSelected(smsEvent) &&
            smsEvent.customEventTemplate.mappedContent.replace(FIND_VARIABLE_REGEX, '{#var#}') != smsEvent.customEventTemplate.rawContent;
    }

    getVariableList(smsEvent: any) {
        return VARIABLE_MAPPED_EVENT_LIST.find(e => e.eventId == smsEvent.id).variableList.map(a => a.displayVariable);
    }

    newTemplateChanged(event: any) {
        this.vm.userInput.newTemplate.rawContent = event.replace(/(\\r)?\\n/g, '\n');
        let textArea = document.getElementById('newTemplate');
        textArea.style.height = '0px';
        textArea.style.height = (textArea.scrollHeight + 30) + 'px';
    }

    selectEvent(eventId: any) {
        this.vm.userInput.selectedEvent = this.vm.backendData.eventList.find(x => x.id == eventId);
        this.vm.userInput.selectedEventSettings = this.vm.userInput.populatedSelectedPageEventsData.find(x => x.id == eventId);
    }

    getSelectedEventTemplateList() {
        let selectedEventSettingsList = this.vm.backendData.selectedPageEventSettingsList.filter
        (setting => setting.SMSEventId == this.vm.userInput.selectedEvent.id);
        return this.vm.backendData.selectedPageTemplateList.filter
        (template => selectedEventSettingsList.some(setting => template.id == setting.parentSMSTemplate));
    }

    getEventName(eventId: any) {
        return this.vm.backendData.eventList.find(x => x.id == eventId).eventName;
    }

    handleBackClick() {
        if (!this.vm.userInput.selectedEvent) {
            this.vm.userInput.selectedPage = null;
        }
        this.vm.userInput.selectedEvent = null;
    }
}
