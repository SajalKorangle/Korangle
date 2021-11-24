import { Component, OnInit } from '@angular/core';
import { DataStorage } from 'app/classes/data-storage';
import { PaymentService } from '@services/modules/payment/payment.service';
import { SetBankAccountServiceAdapter } from './set-bank.account.service.adapter';
import { SchoolMerchantAccount } from '@services/modules/payment/models/school-merchant-account';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VALIDATORS_REGX } from '@classes/regx-validators';


@Component({
    selector: 'app-online-payment-account',
    templateUrl: './set-bank-account.component.html',
    styleUrls: ['./set-bank-account.component.css'],
    providers: [PaymentService]
})
export class SetBankAccountComponent implements OnInit {

    user;
    validators = VALIDATORS_REGX;
    errorMessage: string = '';

    schoolMerchantAccount: SchoolMerchantAccount = new SchoolMerchantAccount();

    settlementCycleList: Array<SettlementOption> = [];

    serviceAdapter: SetBankAccountServiceAdapter;

    cache: {
        bankDetails?: {
            ifsc: string,
            bank: string,
            address: string,
            city: string,
            state: string,
            branch: string,
        },
    } = {};

    isIFSCLoading: boolean = false;

    intermediateUpdateState = {
        ifscVerificationLoading: false,
        accountVerificationLoading: false,
        registrationLoading: false,
    };
    isLoading: boolean = true;

    constructor(public paymentService: PaymentService, public snackBar: MatSnackBar) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new SetBankAccountServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        // populate data
        this.schoolMerchantAccount.parentSchool = this.user.activeSchool.dbId;
        this.schoolMerchantAccount.vendorData.name = this.user.activeSchool.name;
        // console.log('this: ', this);
    }

    resetIntermediateUpdateState(): void {
        this.intermediateUpdateState.accountVerificationLoading = false;
        this.intermediateUpdateState.ifscVerificationLoading = false;
        this.intermediateUpdateState.registrationLoading = false;
        this.isLoading = false;
    }

    isIFSCValidationPasses(): boolean {
        if (this.schoolMerchantAccount.vendorData.bank.ifsc.length == 11
            && this.cache.bankDetails && this.cache.bankDetails.ifsc == this.schoolMerchantAccount.vendorData.bank.ifsc)
            return true;
        return false;
    }

    displayIfscError = (): boolean => {
        if (!this.schoolMerchantAccount.vendorData.bank.ifsc || this.isIFSCLoading)
            return false;
        if (this.isIFSCValidationPasses())
            return false;
        return true;
    }

    isDataValid(): boolean {
        if (this.schoolMerchantAccount.vendorData.bank.ifsc.length != 11) {
            this.errorMessage = 'IFSC Validation Failed';
            return false;
        }

        if (!this.schoolMerchantAccount.vendorData.phone || !this.validators.phoneNumber.test(this.schoolMerchantAccount.vendorData.phone)) {
            this.errorMessage = "Invalid Mobile Number";
            return false;
        }

        if (!this.schoolMerchantAccount.vendorData.email || !this.validators.email.test(this.schoolMerchantAccount.vendorData.email)) {
            this.errorMessage = "Invalid Email";
            return false;
        }

        if (!this.schoolMerchantAccount.vendorData.settlementCycleId) {
            this.errorMessage = "Settlement Cycle is Required";
            return false;
        }

        if (!this.schoolMerchantAccount.vendorData.bank.accountHolder) {
            this.errorMessage = "Account Holder Name is required";
            return false;
        }

        if (!this.schoolMerchantAccount.vendorData.bank.accountNumber || this.schoolMerchantAccount.vendorData.bank.accountNumber.length < 6) {
            this.errorMessage = "Invalid Account Number";
            return false;
        }
        this.errorMessage = "";
        return true;
    }

    isUpdating(): boolean {
        return Object.values(this.intermediateUpdateState).reduce((acc: boolean, next: boolean) => acc || next, false);
    }

}


interface SettlementOption {
    id: string;
    desc: string;
}