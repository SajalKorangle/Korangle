import { MODE_OF_PAYMENT_LIST } from "@modules/fees/classes/constants";

export class FeeSchoolSessionSettings {
    id: number;
    parentSession: number;
    parentSchool: number;
    sessionLocked: boolean;
    accountingSettingsJSON: AccountingSettings;
}

export class FeeSchoolSettings {
    id: number;
    parentSchool: number;
    printSingleReceipt: boolean;
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
