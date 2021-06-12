import { Component, OnInit } from '@angular/core';
import { DataStorage } from 'app/classes/data-storage';
import { FeeService } from '@services/modules/fees/fee.service';
import { OnlinePaymentAccountServiceAdapter } from './online-payment-account.service.adapter';
import { OnlinePaymentAccount } from '@services/modules/fees/models/online-payment-account';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VALIDATORS_REGX } from '@classes/regx-validators';

@Component({
  selector: 'app-online-payment-account',
  templateUrl: './online-payment-account.component.html',
  styleUrls: ['./online-payment-account.component.css'],
  providers: [FeeService]
})
export class OnlinePaymentAccountComponent implements OnInit {

  user;
  validators = VALIDATORS_REGX;

  onlinePaymentAccount: OnlinePaymentAccount = new OnlinePaymentAccount();
  settelmentCycleList: Array<SettelmentOption> = [];

  serviceAdapter: OnlinePaymentAccountServiceAdapter;

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

  constructor(public feeService: FeeService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new OnlinePaymentAccountServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();

    // populate data
    this.onlinePaymentAccount.parentSchool = this.user.activeSchool.dbId;
    this.onlinePaymentAccount.vendorData.name = this.user.activeSchool.name;
    console.log('this: ', this);
  }

  removeNullKeys(obj: { [key: string]: any; }) {
    obj = { ...obj };
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] == 'object') {
        obj[key] = this.removeNullKeys(obj[key]);
      }
      else if (!obj[key]) {
        delete obj[key];
      }
    });
    return obj;
  }

  ifscError = (): boolean => {
    if (!this.onlinePaymentAccount.vendorData.bank.ifsc)
      return false;
    if (this.cache.ifsc && this.cache.ifsc.ifsc == this.onlinePaymentAccount.vendorData.bank.ifsc)
      return false;
    return true;
  };

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

  isUpdating(): boolean {
    return Object.values(this.intermediateUpdateState).reduce((acc: boolean, next: boolean) => acc || next, false);
  }

}


interface SettelmentOption {
  id: string;
  desc: string;
}