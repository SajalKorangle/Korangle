import {ManageSmsIdComponent} from './manage-sms-id.component';

export class ManageSmsIdServiceAdapter {

    vm: ManageSmsIdComponent;

    constructor() { }

    initialize(vm: ManageSmsIdComponent): void {
        this.vm = vm;
    }
    
   async initializeData() {
        this.vm.stateKeeper.isPageLoading = true;
        let smsIdSchoolData = {
            'parentSchool' : this.vm.user.activeSchool.dbId,
        }
       
        this.vm.backendData.SMSIdSchoolList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id_school, smsIdSchoolData);
        
        let smsIdData = {
            'id__in' : this.vm.backendData.SMSIdSchoolList.map((a) => a.parentSMSId).join(),
        }
        
        this.vm.backendData.SMSIdList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id, smsIdData);
        this.vm.htmlRenderer.initializeNewSMSId();
        this.vm.stateKeeper.isPageLoading = false;
    }
    
    async addNewSMSId() {
        this.vm.stateKeeper.isPageLoading = true;
        let smsIdData = {
            'entityName':this.vm.userInput.newSMSId.entityName,
            'entityRegistrationId':this.vm.userInput.newSMSId.entityRegistrationId,
            'smsId':this.vm.userInput.newSMSId.smsId,
            'smsIdRegistrationNumber':this.vm.userInput.newSMSId.smsIdRegistrationNumber
        }
        
        const value = await this.vm.smsService.createObject(this.vm.smsService.sms_id, smsIdData);
        console.log(value)
        let sms_id_school_data = {
            'parentSchool':this.vm.user.activeSchool.dbId,
            'parentSMSId':value.id,
        }
        const value2 = await this.vm.smsService.createObject(this.vm.smsService.sms_id_school,sms_id_school_data)
        console.log(value2)
        
        this.vm.backendData.SMSIdList.push(value);
        this.vm.backendData.SMSIdSchoolList.push(value2);
        this.vm.htmlRenderer.initializeNewSMSId();
        alert('SMS ID Created Successfully');
        this.vm.stateKeeper.isPageLoading = false;
    }
    
    async deleteSMSId(SMSId: any) {
        if(confirm('Are you sure want to delete this SMS ID ?')) {
            this.vm.stateKeeper.isSMSIdTableLoading = true;
            console.log(this.vm.backendData.SMSIdSchoolList);
            let sms_id_school_data = {
                    'id':this.vm.backendData.SMSIdSchoolList.find(smsSchool => smsSchool.parentSMSId == SMSId.id).id
            }
            const value = await this.vm.smsService.deleteObject(this.vm.smsService.sms_id_school, sms_id_school_data);
            console.log(value)
            this.vm.backendData.SMSIdList = this.vm.backendData.SMSIdList.filter(smsId => smsId.id != SMSId.id);
            this.vm.backendData.SMSIdSchoolList = this.vm.backendData.SMSIdSchoolList.filter(smsSchool => smsSchool.id != value);
            console.log(this.vm.backendData.SMSIdSchoolList);
            this.vm.stateKeeper.isSMSIdTableLoading = false;
            alert('SMS ID Deleted Successfully');
        }
        
    }

}
