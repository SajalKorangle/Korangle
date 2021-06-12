import { Component, OnInit } from '@angular/core';
import { DataStorage } from 'app/classes/data-storage';
import { FeeService } from '@services/modules/fees/fee.service';
import { OnlinePaymentAccountServiceAdapter } from './online-payment-account.service.adapter';
import { OnlinePaymentAccount } from '@services/modules/fees/models/online-payment-account';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-online-payment-account',
  templateUrl: './online-payment-account.component.html',
  styleUrls: ['./online-payment-account.component.css'],
  providers: [FeeService]
})
export class OnlinePaymentAccountComponent implements OnInit {

  user;

  onlinePaymentAccount: OnlinePaymentAccount = new OnlinePaymentAccount();
  settelmentCycleList: Array<SettelmentOption> = [];

  serviceAdapter: OnlinePaymentAccountServiceAdapter;

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
  }

  submitForm() {
    if (this.onlinePaymentAccount.id) { // update

    }
    else { // create
      this.serviceAdapter.createOnlinePaymentAccount();
    }
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


}


interface SettelmentOption {
  id: string;
  desc: string;
}