import { AddAccountComponent } from './add-account.component';
import { AccountInfo } from '@services/modules/online-class/models/account-info';

export class AddAccountUserInput {

    newAccountInfo: AccountInfo;

    selectedAccountInfo: AccountInfo = null;

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

    resetNewAccountInfo(): void {
        this.newAccountInfo = { ...DEFAULT_ACCOUNT_INFO };
        if (!this.vm.hasAdminPermission()) {
            this.newAccountInfo = this.vm.user.activeSchool.employeeId;
        }
    }

}


const DEFAULT_ACCOUNT_INFO: AccountInfo = {
    parentEmployee: null,
    username: null,
    password: null,
    meetingNumber: null,
    passcode: null,
};