import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {DataStorage} from "../../../../classes/data-storage";
import { SchoolService } from '../../../../services/modules/school/school.service';
import { AccountsService } from '@services/modules/accounts/accounts.service';
import { MODE_OF_PAYMENT_LIST } from './../../classes/constants';
import { AccountSession } from '@services/modules/accounts/models/account-session';

import { SettingsServiceAdapter } from "./settings.service.adapter";
import { SettingsBackendData } from './settings.backend.data';

@Component({
    selector: 'lock-fees',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [ FeeService, SchoolService, AccountsService ],
})

export class SettingsComponent implements OnInit {

    user;

    activeSession: any;

    customAccountSessionList: Array<CustomAccountSession>;

    searchInput: string = '';
    
    backendData: SettingsBackendData;
    serviceAdapter: SettingsServiceAdapter;

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
        
        this.backendData = new SettingsBackendData(this);

        this.serviceAdapter = new SettingsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        console.log('this: ', this);
    }

    detectChanges(): void { // what is this?
        this.cdRef.detectChanges();
    }

    toggleAccounting(checked: boolean): void{
        if (checked) {
            this.backendData.initilizeAccouting();
        } else {
            this.backendData.feeSettings.accountingSettings = null;
        }
    }

    getPaymentModeList(): Array<string>{
        return MODE_OF_PAYMENT_LIST;
    }

    getAccountName(id: number): string {
        return this.customAccountSessionList.find(accountSession => accountSession.id == id).title;
    }

    addNewAccountInFeePaymentAccountList(customAccountSession, paymentMode): void {
        const alreadyExists = this.backendData.feeSettings.accountingSettings.toAccountsStructure[paymentMode].find(accountSessionId => accountSessionId == customAccountSession.id)!=undefined;
        if (alreadyExists)
            return;
        this.backendData.feeSettings.accountingSettings.toAccountsStructure[paymentMode].push(customAccountSession.id);
    }

    settingsValidityCheck(): boolean{
        let errormsg = ''
        let dataValid = true;
        if (this.backendData.feeSettings.accountingSettings) {
            if (!this.backendData.feeSettings.accountingSettings.parentAccountFrom) {
                dataValid = false;
                errormsg += '\n• Student fee debit account cannot be empty';
            }
            else {
                this.getPaymentModeList().every(paymentMode => {
                    if (this.backendData.feeSettings.accountingSettings.toAccountsStructure[paymentMode].find(accountSessionId => accountSessionId == this.backendData.feeSettings.accountingSettings.parentAccountFrom) != undefined) {
                        dataValid = false;
                        errormsg += '\n• Student fee debit account cannot be included in any accounts under payment mode';
                        return false;   // return of every
                    }
                    return true;    // return of every
                });
            }
            if (!dataValid) {
                alert(errormsg.trim());
            }
        }
        return dataValid;
    }
}

interface CustomAccountSession extends AccountSession{
    type: 'ACCOUNT';
    title: string;
}