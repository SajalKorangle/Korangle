import { AddAccountComponent } from './add-account.component';
import { CommonFunctions } from '@modules/common/common-functions';

export class AddAccountServiceAdapter {

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isLoading = true;

        const routeInformation = CommonFunctions.getModuleTaskPaths();
        const in_page_permission_request = {
            parentTask__parentModule__path: routeInformation.modulePath,
            parentTask__path: routeInformation.taskPath,
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };

        this.vm.backendData.inPagePermissionMappedByKey = (await
            this.vm.employeeService.getObject(this.vm.employeeService.employee_permissions, in_page_permission_request)).configJSON;

        const account_info_list_request = { // all acount info
        };

        if (!this.vm.hasAdminPermission()) {    // restrict to only user's accountInfo
            account_info_list_request['parentEmployee'] = this.vm.user.activeSchool.employeeId;
        }

        const serviceList = [
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.account_info, account_info_list_request),
        ];

        const employee_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
            fields__korangle: ['id', 'name'],
        };
        if (!this.vm.hasAdminPermission()) {
            employee_request['parentEmployee'] = this.vm.user.activeSchool.employeeId;
        }

        serviceList.push(
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_request)
        );

        [
            this.vm.backendData.accountInfoList,
            this.vm.backendData.employeeList] = await Promise.all(serviceList);

        this.vm.dataLoadSetUp();
    }

    async addNewAccountInfo() {
        if (this.vm.userInput.newAccountInfo.meetingNumber || this.vm.userInput.newAccountInfo.passcode) {
            if (!this.vm.newAccountInfoSanatyCheck(this.vm.userInput.newAccountInfo.meetingNumber, this.vm.userInput.newAccountInfo.passcode))
            return;
        }
        else {
            if (!this.vm.newAccountInfoSanatyCheckURL(this.vm.userInput.newAccountInfo.meetingUrl))
                return;
            var patternHttp = new RegExp('^(https?:\\/\\/)');
            if (!patternHttp.test(this.vm.userInput.newAccountInfo.meetingUrl)) {  //if user doesnt enter https to the front of the url
                this.vm.userInput.newAccountInfo.meetingUrl = "https://" + this.vm.userInput.newAccountInfo.meetingUrl; //it adds for the user
            }

        }
        const account_info_request = {
            parentEmployee: this.vm.userInput.newAccountInfo.parentEmployee,
        };

        this.vm.isLoading = true;
        const preExistingAccountInfo = await this.vm.onlineClassService.getObject(this.vm.onlineClassService.account_info, account_info_request);
        if (preExistingAccountInfo) { // account with this username aready exists
            alert("Account with the provided username already exists");
            this.vm.isLoading = false;
            return;
        }
        const createdAccountInfo = await this.vm.onlineClassService.createObject(
            this.vm.onlineClassService.account_info,
            { ...this.vm.userInput.newAccountInfo }
        );
        this.vm.backendData.accountInfoList.push(createdAccountInfo);
        this.vm.userInput.resetNewAccountInfo();
        this.vm.isLoading = false;

    }

    async updateAccountInfo(accountInfo) {
        if (accountInfo.meetingNumber || accountInfo.passcode) {
            if (!this.vm.newAccountInfoSanatyCheck(accountInfo.meetingNumber, accountInfo.passcode))
            return;
        }
        else {
            if (!this.vm.newAccountInfoSanatyCheckURL(accountInfo.meetingUrl))
                return;

            var patternHttp = new RegExp('^(https?:\\/\\/)');
            if (!patternHttp.test(accountInfo.meetingUrl)) {        //if user doesnt enter https to the front of the url
                accountInfo.meetingUrl = "https://" + accountInfo.meetingUrl;
            }
        }
        this.vm.isLoading = true;
        const responseAccountInfo = await this.vm.onlineClassService.updateObject(this.vm.onlineClassService.account_info, accountInfo);
        const originalAccountInfo = this.vm.backendData.accountInfoList.find(ai => ai.id == accountInfo.id);
        Object.assign(originalAccountInfo, responseAccountInfo);
        this.vm.userInput.selectedAccountInfo = null;
        this.vm.isLoading = false;
    }

    async deleteAccountInfo(accountInfo) {
        this.vm.isLoading = true;
        if (!confirm('This account will be deleted permanently')) {
            this.vm.isLoading = false;
            return;
        }
        const delete_request = {
            id: accountInfo.id
        };
        await this.vm.onlineClassService.deleteObject(this.vm.onlineClassService.account_info, delete_request);
        this.vm.backendData.accountInfoList = this.vm.backendData.accountInfoList.filter(a => a.id != accountInfo.id);
        this.vm.isLoading = false;
    }

}
