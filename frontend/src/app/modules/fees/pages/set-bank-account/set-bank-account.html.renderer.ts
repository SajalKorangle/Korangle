import { SetBankAccountComponent } from './set-bank-account.component';

export class SetBankAccountHtmlRenderer {

    vm: SetBankAccountComponent;

    constructor() {}

    initializeRenderer(vm: SetBankAccountComponent) {
        this.vm = vm;
    }

    isBankAccountUpdationEnabled(): boolean {
        return this.vm.backendData.schoolBankAccountUpdationPermissionCountList.length > 0
            && this.vm.backendData.schoolBankAccountUpdationPermissionCountList[0].bankAccountUpdationPermissionCount > 0;
    }

    isUpdateButtonDisabled(): boolean {
        return !this.vm.isDataValid() || !this.isBankAccountUpdationEnabled();
    }

    numberOfTriesLeftStatement(): any {
        let triesLeft = this.vm.backendData.schoolBankAccountUpdationPermissionCountList[0].bankAccountUpdationPermissionCount;
        return  triesLeft + (triesLeft > 1 ? ' tries ' : ' try ') + 'left!!!';
    }

}