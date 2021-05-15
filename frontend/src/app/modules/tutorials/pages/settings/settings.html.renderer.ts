import {SettingsComponent} from '@modules/tutorials/pages/settings/settings.component';

export class SettingsHtmlRenderer {

    vm: SettingsComponent;

    constructor() {
    }


    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }


    isUpdateDisabled(smsEvent: any) {
        if (JSON.stringify(smsEvent) == JSON.stringify(this.vm.populatedSMSEventSettingsList.find(pop => pop.eventName = smsEvent.eventName))) {
            console.log('first');
            console.log(JSON.stringify(smsEvent));
            console.log(JSON.stringify(this.vm.populatedSMSEventSettingsList.find(pop => pop.eventName = smsEvent.eventName)));
            return true;
        }
        if (smsEvent.smsId.smsId != 'Default') {
            if (!smsEvent.customEventTemplate.rawContent || smsEvent.customEventTemplate.rawContent.trim() == '' ||
                !smsEvent.customEventTemplate.templateId || smsEvent.customEventTemplate.templateId.trim() == '' ||
                !smsEvent.customEventTemplate.templateName || smsEvent.customEventTemplate.templateName.trim() == '' ||
                !smsEvent.customEventTemplate.mappedContent || smsEvent.customEventTemplate.mappedContent.trim() == '') {
                console.log(smsEvent.smsId.smsId);
                console.log('second');
                return true;
            }
        }
        return false;
    }

    getUpdateType(smsEvent: any) {
        return this.vm.backendData.sentUpdateList.find(type => type.id == smsEvent.eventSettings.parentSentUpdateType);
    }

    setUpdateType(smsEvent: any, selectedType: any) {
        smsEvent.eventSettings.parentSentUpdateType = selectedType.id;
    }

    getNotificationContent(smsEvent: any) {
        if (smsEvent.eventSettings.notificationMappedContent &&
            smsEvent.eventSettings.notificationMappedContent.trim() == smsEvent.defaultNotificationContent) {
            smsEvent.eventSettings.notificationMappedContent = null;
        }
        return smsEvent.eventSettings.notificationMappedContent ? smsEvent.eventSettings.notificationMappedContent : smsEvent.defaultNotificationContent;
    }

    setNotificationContent(smsEvent: any, $event: any) {
        smsEvent.eventSettings.notificationMappedContent = $event;
    }

    setSMSIdSelection(smsEvent: any, $event: any) {
        let template = this.vm.backendData.customEventTemplateList.find(temp => temp.parentSMSId == $event.Id);
        if (template) {
            smsEvent.eventSettings.parentSMSTemplate = template.id;
            smsEvent.customEventTemplate = template;
        }
        smsEvent.smsId = $event;
    }


    getSelectedSMSId(smsEvent: any) {
        if (smsEvent.customEventTemplate.smsIdStatus) {
            return this.vm.populatedSMSIdList.find(senderId => senderId.id == smsEvent.customEventTemplate.parentSMSId).smsId;
        }
        return this.vm.populatedSMSIdList.find(senderId => senderId.smsId == 'Default');
    }

    getMappedContent(smsEvent) {
        if (smsEvent.smsId.smsId == 'Default') {
            return smsEvent.defaultSMSContent;
        }
        return smsEvent.customEventTemplate.mappedContent;
    }

    rawContentChanged(smsEvent: any, $event: any) {
        smsEvent.customEventTemplate.rawContent = $event;
        smsEvent.customEventTemplate.mappedContent = smsEvent.customEventTemplate.rawContent.replace('{#var#}', '@StudentName');
    }
}

