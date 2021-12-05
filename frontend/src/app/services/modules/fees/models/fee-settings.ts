import { MODE_OF_PAYMENT_LIST } from "@modules/fees/classes/constants";

export class FeeSettings {
    id: number;
    parentSession: number;
    parentSchool: number;
    sessionLocked: boolean;
    accountingSettingsJSON: AccountingSettings;
    percentageTransactionChargeOnSchool: number = 0;
}

export class AccountingSettings {
    parentAccountFrom: number = null;
    toAccountsStructure: {
        'Cash': Array<number>,
        'Cheque': Array<number>,
        'Online': Array<number>;
    } = {
            'Cash': [],
            'Cheque': [],
            'Online': [],
        };
    parentOnlinePaymentCreditAccount: number = null;
}
