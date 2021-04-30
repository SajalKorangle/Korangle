import {ManageSmsIdComponent} from './manage-sms-id.component';

export class ManageSmsIdHtmlRenderer {

    vm: ManageSmsIdComponent;

    constructor() { }

    initialize(vm: ManageSmsIdComponent): void {
        this.vm = vm;
    }
    
    initializeNewSMSId():void {
        this.vm.userInput.newSMSId={
            'entityName':null,
            'entityRegistrationId':null,
            'smsId':null,
            'smsIdRegistrationNumber':null,
        }
    }
    
    getFilteredSMSIdList(): any {
        if(this.vm.userInput.selectedSMSStatus!=='ALL')
            return this.vm.backendData.SMSIdList.filter(smsId=> smsId.status == this.vm.userInput.selectedSMSStatus);
        else
            return this.vm.backendData.SMSIdList;
    }

}
