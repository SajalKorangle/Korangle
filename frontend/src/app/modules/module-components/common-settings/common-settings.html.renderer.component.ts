import {isMobile} from '@classes/common';
import {CommonSettingsComponent} from '@modules/module-components/common-settings/common-settings.component';

export class CommonSettingsHtmlRendererComponent {

    vm: CommonSettingsComponent;

    constructor() {
    }


    initializeAdapter(vm: CommonSettingsComponent): void {
        this.vm = vm;
    }


    isUpdateDisabled(smsEvent: any) {
        if (JSON.stringify(smsEvent) == JSON.stringify(this.vm.populatedSMSEventSettingsList.find(pop => pop.eventName == smsEvent.eventName))) {
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
        let template = this.vm.backendData.customEventTemplateList.find(temp => temp.parentSMSId == $event.Id);
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

    isMobile() {
        return isMobile();
    }

    getExpandedState(panelName: string, smsEvent: any) {
        let tutorialEvent = this.vm.orderedEventNames.find(event => event.name == smsEvent.eventName);
        return tutorialEvent.expansionPanelState[panelName];
    }

    setExpandedState(panelName: string, smsEvent: any, panelEvent: any) {
        let event = this.vm.orderedEventNames.find(event => event.name == smsEvent.eventName);
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

