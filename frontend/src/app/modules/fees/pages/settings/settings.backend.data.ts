import { SettingsComponent } from './settings.component';
import { Account } from '@services/modules/accounts/models/account';
import { FeeSettings, AccountingSettings } from '@services/modules/fees/models/fee-settings';
import { AccountSession } from '@services/modules/accounts/models/account-session';

export class SettingsBackendData {
    vm: SettingsComponent;

    feeSettings: FeeSettings;
    accountsList: Array<Account>;
    accountSessionList: Array<AccountSession>;

    schoolMerchantAccount: {
        id: number,
        isEnabled: boolean,
        easebuzzBankLabel: string,
        platformFeeOnSchoolType: string,
        percentageOfPlatformFeeOnSchool: number,
        maxPlatformFeeOnSchool: number
    };

    constructor(vm: SettingsComponent) {
        this.vm = vm;
    }

    applyDefaultSettings(): void {
        this.feeSettings = new FeeSettings();
        this.feeSettings.parentSchool = this.vm.user.activeSchool.dbId;
        this.feeSettings.parentSession = this.vm.activeSession.id;
        this.feeSettings.sessionLocked = false;
        this.feeSettings.accountingSettingsJSON = null; // null value signifies accounting is disabled
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