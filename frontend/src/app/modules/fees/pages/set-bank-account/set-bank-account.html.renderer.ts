import { SetBankAccountComponent } from './set-bank-account.component';
import { DataStorage } from '@classes/data-storage';

export class SetBankAccountHtmlRenderer {

    vm: SetBankAccountComponent;

    constructor() {}

    initializeRenderer(vm: SetBankAccountComponent) {
        this.vm = vm;
    }

    isUpdatingBankDetailsAllowed(): boolean {
        if (DataStorage.getInstance().isFeatureEnabled("Easebuzz in Pay Fees page feature flag")) {
            return this.vm.schoolMerchantAccount.easebuzzBankLabel!="";
        }
        return true;
    }

    isBankAccountUpdationEnabled(): boolean {
        return this.vm.backendData.schoolBankAccountUpdationPermissionCountList.length > 0
            && this.vm.backendData.schoolBankAccountUpdationPermissionCountList[0].bankAccountUpdationPermissionCount > 0
            && this.isUpdatingBankDetailsAllowed();
    }

    isUpdateButtonDisabled(): boolean {
        return !this.vm.isDataValid() || !this.isBankAccountUpdationEnabled();
    }

    numberOfTriesLeftStatement(): any {
        let triesLeft = this.vm.backendData.schoolBankAccountUpdationPermissionCountList[0].bankAccountUpdationPermissionCount;
        return  triesLeft + (triesLeft > 1 ? ' tries ' : ' try ') + 'left!!!';
    }

}