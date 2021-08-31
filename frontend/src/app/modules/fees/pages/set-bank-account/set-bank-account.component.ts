import { Component, OnInit } from '@angular/core';
import { DataStorage } from 'app/classes/data-storage';
import { PaymentService } from '@services/modules/payment/payment.service';
import { SetBankAccountServiceAdapter } from './set-bank.account.service.adapter';
import { OnlinePaymentAccount } from '@services/modules/payment/models/online-payment-account';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VALIDATORS_REGX } from '@classes/regx-validators';

// Code Review
// Please indent the code with 4 spaces.

@Component({
  selector: 'app-online-payment-account',
  templateUrl: './set-bank-account.component.html',
  styleUrls: ['./set-bank-account.component.css'],
  providers: [PaymentService]
})
export class SetBankAccountComponent implements OnInit {

  user;
  validators = VALIDATORS_REGX;

  onlinePaymentAccount: OnlinePaymentAccount = new OnlinePaymentAccount();

  // Code Review
  // Correct the settelment spelling.
  settelmentCycleList: Array<SettelmentOption> = [];

  serviceAdapter: SetBankAccountServiceAdapter;

  cache: {
    ifsc?: {
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
    this.onlinePaymentAccount.parentSchool = this.user.activeSchool.dbId;
    this.onlinePaymentAccount.vendorData.name = this.user.activeSchool.name;
    // console.log('this: ', this);
  }

  // Code Review
  // This function is only being used in service adapter, so move it there.
  resetintermediateUpdateState(): void {
    this.intermediateUpdateState.accountVerificationLoading = false;
    this.intermediateUpdateState.ifscVerificationLoading = false;
    this.intermediateUpdateState.registrationLoading = false;
    this.isLoading = false;
  }

  // Code Review
  // This function is only being used in service adapter, so move it there.
  getRequiredPaymentAccountData() {
    const requiredOnlyFields: OnlinePaymentAccount = JSON.parse(JSON.stringify(this.onlinePaymentAccount));
    delete requiredOnlyFields.vendorData.addedOn;
    delete requiredOnlyFields.vendorData.balance;
    delete requiredOnlyFields.vendorData.status;
    delete requiredOnlyFields.vendorData.upi;
    requiredOnlyFields.vendorData.settlementCycleId = parseInt(requiredOnlyFields.vendorData.settlementCycleId.toString());
    return requiredOnlyFields;
  }

  // Code Review
  // Transfer this function to html renderer file.
  ifscError = (): boolean => {
    // Code Review
    // ifsc is not loading and ifsc
    if (!this.onlinePaymentAccount.vendorData.bank.ifsc || this.isIFSCLoading)
      return false;
    if (this.cache.ifsc && this.cache.ifsc.ifsc == this.onlinePaymentAccount.vendorData.bank.ifsc)
      return false;
    return true;
  }

  // Code Review
  // This function is only being used in service adapter, so move it there.
  offlineValidation(): boolean {
    if (this.onlinePaymentAccount.vendorData.bank.ifsc.length != 11) {
      alert('Invalid IFSC');
      return false;
    }

    if (!this.onlinePaymentAccount.vendorData.phone || !this.validators.phoneNumber.test(this.onlinePaymentAccount.vendorData.phone)) {
      alert('Invalid Mobile Number');
      return false;
    }

    if (!this.onlinePaymentAccount.vendorData.email || !this.validators.email.test(this.onlinePaymentAccount.vendorData.email)) {
      alert("Invalid Email");
      return false;
    }

    if (!this.onlinePaymentAccount.vendorData.settlementCycleId) {
      alert("Settelment Cycle is Required");
      return false;
    }

    if (!this.onlinePaymentAccount.vendorData.bank.accountHolder) {
      alert("Account Holder Name is required");
      return false;
    }

    if (!this.onlinePaymentAccount.vendorData.bank.accountNumber || this.onlinePaymentAccount.vendorData.bank.accountNumber.length < 6) {
      alert("Invalid Account Number");
      return false;
    }
    return true;
  }

    // Code Review
    // 1. If the update is going on, what does isUpdating returning, true or false?
    // I think the nomenclature of this function is opposite.
    // 2. Also, move this function to html renderer file.
  isUpdating(): boolean {
    return Object.values(this.intermediateUpdateState).reduce((acc: boolean, next: boolean) => acc || next, false);
  }

}


interface SettelmentOption {
  id: string;
  // Code Review
  // Use full words in variable names.
  desc: string;
}