import { CollectFeeComponent } from './collect-fee.component';
import { Account } from '@services/modules/accounts/models/account';

export class CollectFeeHTMLRenderer{

    vm: CollectFeeComponent;

    constructor(vm: CollectFeeComponent) {
        this.vm = vm;
    }

    getFilteredPaymentAccounts(): Array<Account>{
        const filteredPaymentAccontsList = this.vm.feePaymentAccountsList.filter(fpa => fpa.modeOfPayment == this.vm.newModeOfPayment);
        const filteredAccountsIdList: Array<number> = filteredPaymentAccontsList.map(fpa => fpa.parentAccount);
        return this.vm.accountsList.filter(account => filteredAccountsIdList.find(id=> id==account.id));
    }
}