import { SettingsComponent } from './settings.component';
import { Account } from '@services/modules/accounts/models/account';
import { FeeSettings, AccountingSettings } from '@services/modules/fees/models/fee-settings';
import { AccountSession } from '@services/modules/accounts/models/account-session';

export class SettingsBackendData {
    vm: SettingsComponent
        
    feeSettings: FeeSettings;
    accountsList: Array<Account>;
    accountSessionList: Array<AccountSession>;
    count=0

    constructor(vm: SettingsComponent) {
        this.vm = vm;
    }

    getCustomAccountList(): Array<CustomAccountSession>{
        console.log("getCustomAccountList calling Count = ", ++count);
        return this.accountSessionList.map(accountSession => {
            return {
                ...accountSession,
                type: 'ACCOUNT',
                title: this.accountsList.find(account=> account.id==accountSession.parentAccount).title,
            }
        })
    }

    applyDefaultSettings(): void{
        this.feeSettings = new FeeSettings();
        this.feeSettings.parentSchool = this.vm.user.activeSchool.dbId;
        this.feeSettings.parentSession = this.vm.activeSession.id;
        this.feeSettings.sessionLocked = false;
        this.feeSettings.accountingSettings = null; // null value signifies accounting is disabled
    }

    initilizeAccouting(): void{
        this.feeSettings.accountingSettings = new AccountingSettings();
    }

}

interface CustomAccountSession extends AccountSession{
    type: 'ACCOUNT';
    title: string;
}