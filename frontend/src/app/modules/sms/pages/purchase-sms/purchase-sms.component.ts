import { Component, OnInit } from '@angular/core';
import {ChangeDetectorRef} from '@angular/core'
import { PurchaseSmsServiceAdapter} from './purchase-sms.service.adapter'
import {UserService} from "../../../../services/modules/user/user.service";
import { SmsService } from "../../../../services/modules/sms/sms.service";
import { WindowRefService } from "../../../../services/modules/sms/window-ref.service"
import { DataStorage } from 'app/classes/data-storage';
import { SmsOldService } from 'app/services/modules/sms/sms-old.service';


@Component({
  selector: 'app-purchase-sms',
  templateUrl: './purchase-sms.component.html',
  styleUrls: ['./purchase-sms.component.css'],
  providers: [ UserService, SmsService, WindowRefService],

})
export class PurchaseSmsComponent implements OnInit {


  user;
  serviceAdapter: PurchaseSmsServiceAdapter;
  isLoading = false;
  isInitialLoading = false

  smsPlan = [
    { noOfSms: 5000,  price: 1250 },
    { noOfSms: 20000, price: 5000 },
    { noOfSms: 30000, price: 7200 }
  ];
  defaultPlan = {noOfSms:'',price:''};
  selectedSmsPlan =this.defaultPlan;

  SMSCount : Number


  constructor(public smsService: SmsService,
              public smsOldService: SmsOldService,
              public userService: UserService,
              public winRef: WindowRefService,
              public ref: ChangeDetectorRef) { }

  ngOnInit() {

    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new PurchaseSmsServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

}
