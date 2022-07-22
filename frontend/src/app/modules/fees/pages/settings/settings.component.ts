import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FeeService } from "../../../../services/modules/fees/fee.service";
import { DataStorage } from "../../../../classes/data-storage";
import { SchoolService } from '../../../../services/modules/school/school.service';
import { AccountsService } from '@services/modules/accounts/accounts.service';
import { MODE_OF_PAYMENT_LIST } from './../../classes/constants';
import { AccountSession } from '@services/modules/accounts/models/account-session';

import { SettingsServiceAdapter } from "./settings.service.adapter";
import { SettingsBackendData } from './settings.backend.data';
import { SettingsHtmlRenderer } from './settings.html.renderer';

import {CommonFunctions} from '@classes/common-functions';
import { GenericService } from '@services/generic/generic-service';

@Component({
    selector: 'lock-fees',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [GenericService, FeeService, SchoolService, AccountsService],
})

export class SettingsComponent implements OnInit {

    user;

    activeSession: any;

    customAccountSessionList: Array<CustomAccountSession>;

    searchInput: string = '';

    backendData: SettingsBackendData;
    serviceAdapter: SettingsServiceAdapter;
    htmlRenderer = new SettingsHtmlRenderer(this);

    commonFunctions = CommonFunctions.getInstance();

    printSingleReceipt: boolean;

    isActiveSession: boolean;
    isLoading = false;
    isLoadingPrintSingleReceiptSetting = false;

    constructor(
        public genericService: GenericService,
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
    }

    detectChanges(): void { // what is this?
        this.cdRef.detectChanges();
    }

    toggleAccounting(checked: boolean): void {
        if (checked) {
            this.backendData.initializeAccounting();
        } else {
            this.backendData.feeSettings.accountingSettingsJSON = null;
        }
    }

    getPaymentModeList(): Array<string> {
        return MODE_OF_PAYMENT_LIST;
    }

    getAccountName(id: number): string {
        return this.customAccountSessionList.find(accountSession => accountSession.id == id).title;
    }

    addNewAccountInFeePaymentAccountList(customAccountSession, paymentMode): void {
        const alreadyExists = this.backendData.feeSettings.accountingSettingsJSON.toAccountsStructure[paymentMode]
            .find(accountSessionId => accountSessionId == customAccountSession.id) != undefined;
        if (alreadyExists)
            return;
        this.backendData.feeSettings.accountingSettingsJSON.toAccountsStructure[paymentMode].push(customAccountSession.id);
    }

    settingsValidityCheck(): boolean {
        let errormsg = '';
        let dataValid = true;
        if (this.backendData.feeSettings.accountingSettingsJSON) {
            if (!this.backendData.feeSettings.accountingSettingsJSON.parentAccountFrom) {
                dataValid = false;
                errormsg += '\n• Student Fee Debit Account cannot be empty';
            }
            else if (!this.backendData.feeSettings.accountingSettingsJSON.parentOnlinePaymentCreditAccount) {
                dataValid = false;
                errormsg += '\n• Onine Payment Credit Account cannot be empty';
            }
            else {
                this.getPaymentModeList().every(paymentMode => {
                    if (this.backendData.feeSettings.accountingSettingsJSON.toAccountsStructure[paymentMode].find(
                        accountSessionId => accountSessionId == this.backendData.feeSettings.accountingSettingsJSON.parentAccountFrom) != undefined) {
                        dataValid = false;
                        errormsg += '\n• Student fee debit account cannot be included in any accounts under payment mode';
                        return false;   // return of every
                    }
                    return true;    // return of every
                });
                if (dataValid
                    && this.backendData.feeSettings.accountingSettingsJSON.parentAccountFrom ==
                    this.backendData.feeSettings.accountingSettingsJSON.parentOnlinePaymentCreditAccount) {
                    dataValid = false;
                    errormsg += '\n• Onine Payment Credit Account cannot be same as Student Fee Debit Account';
                }
            }
            if (!dataValid) {
                alert(errormsg.trim());
            }
        }
        return dataValid;
    }
}

interface CustomAccountSession extends AccountSession {
    type: 'ACCOUNT';
    title: string;
}
