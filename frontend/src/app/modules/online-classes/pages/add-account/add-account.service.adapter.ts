import {AddAccountComponent} from './add-account.component';

export class AddAccountServiceAdapter {

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isLoading = true;
        
        const account_info_list_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentEmployee: this.vm.user.activeSchool.employeeId
        }

        this.vm.backendData.accountInfoList = await this.vm.onlineClassService.getObjectList(
            this.vm.onlineClassService.account_info, account_info_list_request
        );

        this.vm.isLoading = false;
    }

    async addNewAccountInfo(){
        if(!this.vm.newAccountInfoSanatyCheck())
            return;
        const newAccountInfo = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentEmployee: this.vm.user.activeSchool.employeeId,
            username: this.vm.userInput.newUsername,
            password: this.vm.userInput.newPassword,
        }

        const account_info_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
            username: this.vm.userInput.newUsername,
        }

        this.vm.isLoading = true;
        const preExistingAccountInfo = await this.vm.onlineClassService.getObject(this.vm.onlineClassService.account_info, account_info_request);
        console.log(preExistingAccountInfo);
        if(preExistingAccountInfo){ // account with this username aready exists
            alert("Account with the provided username already exists");
            this.vm.isLoading = false;
            return;
        }
        const createdAccountInfo = await this.vm.onlineClassService.createObject(this.vm.onlineClassService.account_info, newAccountInfo);
        this.vm.backendData.accountInfoList.push(createdAccountInfo);
        this.vm.userInput.newUsername = '';
        this.vm.userInput.newPassword = '';
        this.vm.isLoading = false;
    }

}
