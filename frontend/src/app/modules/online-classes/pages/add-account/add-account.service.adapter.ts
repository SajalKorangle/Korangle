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
        if (this.vm.userInput.newAccountInfo.meetingNumber) {
            if (!this.vm.newAccountInfoSanatyCheck())
            return;
            this.vm.userInput.newAccountInfo.meetingUrl = null;
        }
        else {
            if (!this.vm.newAccountInfoSanatyCheckURL())
                return;

            if (!this.vm.validURL(this.vm.userInput.newAccountInfo.meetingUrl))
                return;

            this.vm.userInput.newAccountInfo.meetingNumber = 0;
            this.vm.userInput.newAccountInfo.passcode = null;

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
        this.vm.isLoading = true;
        const responseAccountInfo = await this.vm.onlineClassService.updateObject(this.vm.onlineClassService.account_info, accountInfo);
        const originalAccountInfo = this.vm.backendData.accountInfoList.find(ai => ai.id == accountInfo.id);
        Object.assign(originalAccountInfo, responseAccountInfo);
        this.vm.userInput.selectedAccountInfo = null;
        this.vm.isLoading = false;
    }

    async deleteAccountInfo(accountInfo) {
        this.vm.isLoading = true;
        if (!confirm('This account will be deleted permanently'))
            return;
        const delete_request = {
            id: accountInfo.id
        };
        await this.vm.onlineClassService.deleteObject(this.vm.onlineClassService.account_info, delete_request);
        this.vm.backendData.accountInfoList = this.vm.backendData.accountInfoList.filter(a => a.id != accountInfo.id);
        this.vm.isLoading = false;
    }

}
