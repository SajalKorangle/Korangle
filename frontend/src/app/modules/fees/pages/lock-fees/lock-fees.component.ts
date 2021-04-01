import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { LockFeesServiceAdapter } from "./lock-fees.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {DataStorage} from "../../../../classes/data-storage";
import { SchoolService } from '../../../../services/modules/school/school.service';
import { AccountsService } from '@services/modules/accounts/accounts.service';

import { FeeSettings } from '@services/modules/fees/models/fee-settings';
import { FeePaymentAccounts, MODE_OF_PAYMENT } from '@services/modules/fees/models/fee-payment-accounts';
import { Account } from '@services/modules/accounts/models/account';
@Component({
    selector: 'lock-fees',
    templateUrl: './lock-fees.component.html',
    styleUrls: ['./lock-fees.component.css'],
    providers: [ FeeService, SchoolService, AccountsService ],
})

export class LockFeesComponent implements OnInit {

    sessionList = [] ;

    user;

    serviceAdapter: LockFeesServiceAdapter;

    lockFees = null;

    feeSettings: FeeSettings;
    feePaymentAccountsList: Array<FeePaymentAccounts>;

    accountsList: Array<Account>;

    searchInput: string = '';
    
    isLoading = false;

    constructor(
        public schoolService: SchoolService,
        public feeService: FeeService,
        public accountsService: AccountsService,
        private cdRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new LockFeesServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        console.log('this: ', this);
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getSession(sessionId: any): any {
        return this.sessionList.find(session => {
            return session.id == sessionId;
        });
    }

    enbaleAccountingHandler(): void{
        this.feeSettings = new FeeSettings();
        this.feeSettings.parentSchool = this.user.activeSchool.dbId;
    }

    getPaymentModeList(): Array<string>{
        return Object.values(MODE_OF_PAYMENT);
    }

    getPaymentModeFilteredFeeAccountsList(paymentMode): Array<FeePaymentAccounts>{
        return this.feePaymentAccountsList.filter(fpa => fpa.modeOfPayment == paymentMode);
    }

    removeFeePaymentAccount(paymentAccount: FeePaymentAccounts) {
        const index = this.feePaymentAccountsList.findIndex(fpa => fpa == paymentAccount);
        this.feePaymentAccountsList.splice(index, 1);
    }

    getAccountName(id: number): string {
        return this.accountsList.find(account => account.id == id).title;
    }

    addNewAccountInFeePaymentAccountList(account, paymentMode): void {
        const alreadyExists = this.feePaymentAccountsList.find(fpa => fpa.parentAccount == account.id && fpa.modeOfPayment == paymentMode)!=undefined;
        if (alreadyExists)
            return;
        const newPaymentAccount = new FeePaymentAccounts();
        newPaymentAccount.parentSchool = this.user.activeSchool.dbId;
        newPaymentAccount.modeOfPayment = paymentMode;
        newPaymentAccount.parentAccount = account.id;
        this.feePaymentAccountsList.push(newPaymentAccount);
    }

    settingsValidityCheck(): boolean{
        let errormsg = ''
        let dataValid = true;
        Object.values(MODE_OF_PAYMENT).forEach(paymentMode => {
            if (this.getPaymentModeFilteredFeeAccountsList(paymentMode).length == 0) {
                dataValid = false;
            }
        });
        if (!dataValid) {
            errormsg += '• Atleast one account is required in each payment mode';
        }
        if (!this.feeSettings.fromAccount) {
            dataValid = false;
            errormsg += '\n• Student fee debit account cannot be empty';
        }
        else {
            if (this.feePaymentAccountsList.find(fpa => fpa.parentAccount == this.feeSettings.fromAccount) != undefined) {
                dataValid = false;
                errormsg += '\n• Student fee debit account cannot be included in any accounts under payment mode';
            }
        }
        if (!dataValid) {
            alert(errormsg.trim());
        }
        return dataValid;
    }
}
