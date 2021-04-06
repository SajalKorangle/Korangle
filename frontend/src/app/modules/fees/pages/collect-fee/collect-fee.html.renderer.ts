import { CollectFeeComponent } from './collect-fee.component';
import { Account } from '@services/modules/accounts/models/account';
import { AccountSession } from '@services/modules/accounts/models/account-session';
export class CollectFeeHTMLRenderer{

    vm: CollectFeeComponent;
    
    customAccountSessionList: Array<CustomAccountSession>;

    constructor(vm: CollectFeeComponent) {
        this.vm = vm;
    }

    getFilteredPaymentAccounts(): Array<CustomAccountSession>{
        const filteredPaymentAccontsList = this.vm.feePaymentAccountsList.filter(fpa => fpa.modeOfPayment == this.vm.newModeOfPayment);
        const filteredAccountsIdList: Array<number> = filteredPaymentAccontsList.map(fpa => fpa.parentAccountSession);
        return this.customAccountSessionList.filter(customAccountSession => filteredAccountsIdList.find(id=> id==customAccountSession .id));
    }

    populateCustomAccountSessionList(accountsList: Array<Account>, accountSessionList: Array<AccountSession>): void{
        this.customAccountSessionList = accountSessionList.map(accountSession => {
            return {
                ...accountSession,
                type: 'ACCOUNT',
                title: accountsList.find(account=> account.id==accountSession.parentAccount).title,
            }
        })
    }
}

interface CustomAccountSession extends AccountSession{
    type: 'ACCOUNT';
    title: string;
}