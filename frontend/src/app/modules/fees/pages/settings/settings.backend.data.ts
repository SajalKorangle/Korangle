import { SettingsComponent } from './settings.component';
import { Account } from '@services/modules/accounts/models/account';
import { FeeSchoolSessionSettings, AccountingSettings, FeeSchoolSettings } from '@services/modules/fees/models/fee-settings';
import { AccountSession } from '@services/modules/accounts/models/account-session';

export class SettingsBackendData {
    vm: SettingsComponent;

    feeSettings: FeeSchoolSessionSettings;
    feeSchoolSettings: FeeSchoolSettings;
    accountsList: Array<Account>;
    accountSessionList: Array<AccountSession>;

    schoolMerchantAccount: {id: number, isEnabled: boolean, percentageOfPlatformFeeOnSchool: number};

    constructor(vm: SettingsComponent) {
        this.vm = vm;
    }

    applyDefaultSettings(): void {
        this.feeSettings = new FeeSchoolSessionSettings();
        this.feeSettings.parentSchool = this.vm.user.activeSchool.dbId;
        this.feeSettings.parentSession = this.vm.activeSession.id;
        this.feeSettings.sessionLocked = false;
        this.feeSettings.accountingSettingsJSON = null; // null value signifies accounting is disabled
    }

    applyDefaultSchoolSettings(): void{
        this.feeSchoolSettings = new FeeSchoolSettings();
        this.feeSchoolSettings.printSingleReceipt = false;
        this.feeSchoolSettings.parentSchool = this.vm.user.activeSchool.dbId;
    }

    initializeAccounting(): void {
        this.feeSettings.accountingSettingsJSON = new AccountingSettings();
    }

    filterInvalidAccounts(): void {
        if (this.feeSettings.accountingSettingsJSON) {
            this.vm.getPaymentModeList().forEach(paymentMode => {
                this.feeSettings.accountingSettingsJSON.toAccountsStructure[paymentMode] =
                    this.feeSettings.accountingSettingsJSON.toAccountsStructure[paymentMode]
                        .filter(accountSessionId => this.accountSessionList.find(accountSession => accountSession.id == accountSessionId));
            });
        }
    }

}