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
            return this.vm.backendData.SMSIdList.filter(smsId=> smsId.smsIdStatus === this.vm.userInput.selectedSMSStatus);
        else
            return this.vm.backendData.SMSIdList;
    }

    checkNullAndEmptySpace():boolean {
        if(!this.vm.userInput.newSMSId.entityName || this.vm.userInput.newSMSId.entityName.trim()==''){
            return true;
        }
        if(!this.vm.userInput.newSMSId.entityRegistrationId || this.vm.userInput.newSMSId.entityRegistrationId.trim()==''){
            return true;
        }
        if(!this.vm.userInput.newSMSId.smsId || this.vm.userInput.newSMSId.smsId.trim()==''){
            return true;
        }
        if(!this.vm.userInput.newSMSId.smsIdRegistrationNumber || this.vm.userInput.newSMSId.smsIdRegistrationNumber.trim()==''){
            return true;
        }
        return false;
    }

    smsIdAlreadyExist() {
        return !this.checkNullAndEmptySpace() && !!this.vm.backendData.SMSIdList.find((smsId) => {
            return smsId.entityName == this.vm.userInput.newSMSId.entityName && smsId.entityRegistrationId == this.vm.userInput.newSMSId.entityRegistrationId && smsId.smsId == this.vm.userInput.newSMSId.smsId && smsId.smsIdRegistrationNumber == this.vm.userInput.newSMSId.smsIdRegistrationNumber
        });
    }
    
}
