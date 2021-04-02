import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { LockFeesServiceAdapter } from "./lock-fees.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {DataStorage} from "../../../../classes/data-storage";
import { SchoolService } from '../../../../services/modules/school/school.service';
import { AccountsService } from '@services/modules/accounts/accounts.service';

import { FeeSettings } from '@services/modules/fees/models/fee-settings';
import { FeePaymentAccounts, MODE_OF_PAYMENT } from '@services/modules/fees/models/fee-payment-accounts';
import { Account } from '@services/modules/accounts/models/account';
import { AccountSession } from '@services/modules/accounts/models/account-session';

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
    accountSessionList: Array<AccountSession>;

    customAccountSessionList: Array<CustomAccountSession>;

    searchInput: string = '';
    
    isActiveSession: boolean;

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
        this.feeSettings.parentSession = this.user.activeSchool.currentSessionDbId;
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
        return this.customAccountSessionList.find(accountSession => accountSession.id == id).title;
    }

    addNewAccountInFeePaymentAccountList(customAccountSession, paymentMode): void {
        const alreadyExists = this.feePaymentAccountsList.find(fpa => fpa.parentAccountSession == customAccountSession.id && fpa.modeOfPayment == paymentMode)!=undefined;
        if (alreadyExists)
            return;
        const newPaymentAccount = new FeePaymentAccounts();
        newPaymentAccount.parentSchool = this.user.activeSchool.dbId;
        newPaymentAccount.parentSession = this.user.activeSchool.currentSessionDbId;
        newPaymentAccount.modeOfPayment = paymentMode;
        newPaymentAccount.parentAccountSession = customAccountSession.id;
        this.feePaymentAccountsList.push(newPaymentAccount);
    }

    settingsValidityCheck(): boolean{
        let errormsg = ''
        let dataValid = true;
        if (!this.feeSettings.fromAccountSession) {
            dataValid = false;
            errormsg += '\n• Student fee debit account cannot be empty';
        }
        else {
            if (this.feePaymentAccountsList.find(fpa => fpa.parentAccountSession == this.feeSettings.fromAccountSession) != undefined) {
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

interface CustomAccountSession extends AccountSession{
    type: 'ACCOUNT';
    title: string;
}