import {ManageDefaultersTemplateComponent} from './manage-defaulters-template.component';
import {isMobile} from '@classes/common';

export class ManageDefaultersTemplateHtmlRenderer {

    vm: ManageDefaultersTemplateComponent;

    constructor() { }

    initialize(vm: ManageDefaultersTemplateComponent): void {
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
        let returnData = this.vm.backendData.templateList;
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

}
