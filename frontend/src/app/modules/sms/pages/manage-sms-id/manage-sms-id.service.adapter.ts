import {ManageSmsIdComponent} from './manage-sms-id.component';

export class ManageSmsIdServiceAdapter {

    vm: ManageSmsIdComponent;

    constructor() { }

    initialize(vm: ManageSmsIdComponent): void {
        this.vm = vm;
    }
    
   async initializeData() {
        this.vm.stateKeeper.isLoading = true;
        let smsIdSchoolData = {
            'parentSchool' : this.vm.user.activeSchool.dbId,
        }
       
        this.vm.backendData.SMSIdSchoolList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id_school, smsIdSchoolData);
        
        let smsIdData = {
            'id__in' : this.vm.backendData.SMSIdSchoolList.map((a) => a.parentSMSId).join(),
        }
        
        this.vm.backendData.SMSIdList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id, smsIdData);
        this.vm.htmlRenderer.initializeNewSMSId();
        this.vm.stateKeeper.isLoading = false;
    }
    
    async addNewSMSId() {
        this.vm.stateKeeper.isLoading = true;
        let smsIdData = {
            'entityName':this.vm.userInput.newSMSId.entityName,
            'entityRegistrationId':this.vm.userInput.newSMSId.entityRegistrationId,
            'smsId':this.vm.userInput.newSMSId.smsId,
            'smsIdRegistrationNumber':this.vm.userInput.newSMSId.smsIdRegistrationNumber
        }
        
        const value = await this.vm.smsService.createObject(this.vm.smsService.sms_id, smsIdData);
        this.vm.backendData.SMSIdList.push(value);
        this.vm.stateKeeper.isLoading = false;
    }
    
    async deleteSMSId(SMSId: any) {
        if(confirm('Are you sure want to delete this SMS ID ?')) {
            this.vm.stateKeeper.isSMSIdTableLoading = true;
            const value = await this.vm.smsService.deleteObject(this.vm.smsService.sms_id, {'id': SMSId.id});
            this.vm.backendData.SMSIdList.filter(smsId => smsId.id != SMSId.id);
            this.vm.stateKeeper.isSMSIdTableLoading = false;
        }
        
    }

}
