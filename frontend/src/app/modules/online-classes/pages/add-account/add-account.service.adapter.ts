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

        const account_info_list_request = {
        };

        if (!this.vm.hasAdminPermission()) {
            account_info_list_request['parentEmployee'] = this.vm.user.activeSchool.employeeId;
        }

        const serviceList = [
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.account_info, account_info_list_request),
        ];

        if (this.vm.hasAdminPermission()) {
            const employee_request = {
                parentSchool: this.vm.user.activeSchool.dbId,
                fields__korangle: ['id', 'name'],
            };
            serviceList.push(
                this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_request)
            );
        }

        [
            this.vm.backendData.accountInfoList,
            this.vm.backendData.employeeList] = await Promise.all(serviceList);

        this.vm.isLoading = false;
    }

    async addNewAccountInfo() {
        if (!this.vm.newAccountInfoSanatyCheck())
            return;
        const newAccountInfo = {
            parentEmployee: this.vm.userInput.parentEmployeeForAccountInfo,
            username: this.vm.userInput.newUsername,
            password: this.vm.userInput.newPassword,
        };

        const account_info_request = {
            parentEmployee__parentSchool: this.vm.user.activeSchool.dbId,
            username: this.vm.userInput.newUsername,
        };

        this.vm.isLoading = true;
        const preExistingAccountInfo = await this.vm.onlineClassService.getObject(this.vm.onlineClassService.account_info, account_info_request);
        if (preExistingAccountInfo) { // account with this username aready exists
            alert("Account with the provided username already exists");
            this.vm.isLoading = false;
            return;
        }
        const createdAccountInfo = await this.vm.onlineClassService.createObject(this.vm.onlineClassService.account_info, newAccountInfo);
        this.vm.backendData.accountInfoList.push(createdAccountInfo);
        this.vm.userInput.newUsername = '';
        this.vm.userInput.newPassword = '';
        this.vm.userInput.parentEmployeeForAccountInfo = this.vm.user.activeSchool.employeeId;
        this.vm.isLoading = false;
    }

    async updateAccountInfo(accountInfo) {
        const responseAccountInfo = await this.vm.onlineClassService.updateObject(this.vm.onlineClassService.account_info, accountInfo);
        const originalAccountInfo = this.vm.backendData.accountInfoList.find(ai => ai.id == accountInfo.id);
        Object.assign(originalAccountInfo, responseAccountInfo);
        this.vm.userInput.selectedAccountInfo = null;
    }

}
