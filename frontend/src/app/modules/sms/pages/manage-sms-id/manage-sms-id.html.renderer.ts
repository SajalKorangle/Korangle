import {ManageSmsIdComponent} from './manage-sms-id.component';
import {toR3Reference} from '@angular/compiler-cli/src/ngtsc/annotations/src/util';

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
        if(!this.vm.userInput.newSMSId.smsId || this.vm.userInput.newSMSId.smsId.trim()=='' || this.vm.userInput.newSMSId.smsId.length != 6){
            return true;
        }
        if(!this.vm.userInput.newSMSId.smsIdRegistrationNumber || this.vm.userInput.newSMSId.smsIdRegistrationNumber.trim()==''){
            return true;
        }
        return false;
    }

    smsIdAlreadyExist() {
        return this.vm.userInput.newSMSId.smsId && !!this.vm.backendData.SMSIdList.find((smsId) => {
           return smsId.smsId == this.vm.userInput.newSMSId.smsId;
        });
    }


    invalidSMSIdDetails() {
        if(this.vm.backendData.existingSMSIdDetails && !this.smsIdAlreadyExist()){
            if(this.vm.userInput.newSMSId.entityRegistrationId && this.vm.userInput.newSMSId.entityRegistrationId != this.vm.backendData.existingSMSIdDetails.entityRegistrationId){
                return true;
            }
        }
        return false;   
    }
}
