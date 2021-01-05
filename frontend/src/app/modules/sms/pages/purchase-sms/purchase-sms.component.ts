import { Component, OnInit } from '@angular/core';
import {ChangeDetectorRef} from '@angular/core'
import { PurchaseSmsServiceAdapter} from './purchase-sms.service.adapter'
import {UserService} from "../../../../services/modules/user/user.service";
import { SmsService } from "../../../../services/modules/sms/sms.service";
import { WindowRefService } from "../../../../services/modules/sms/window-ref.service"
import { DataStorage } from 'app/classes/data-storage';
import { SmsOldService } from 'app/services/modules/sms/sms-old.service';
import { Options } from 'ng5-slider/options';


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
    { noOfSms: 5000,  price: 1250, selected:false },
    { noOfSms: 20000, price: 5000, selected:false },
    { noOfSms: 30000, price: 7200, selected:false }
  ];
  defaultPlan = {noOfSms:'',price:''};
  selectedSmsPlan =this.defaultPlan;

  SMSCount =0;
  price = 0;
  noOfSMS =0;


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
  


  value: number = 0;
  value1: number = 0;



  callSetBubble(event)
  { 
    let range = document.querySelector(".range");
    let bubble = document.querySelector(".bubble");
    this.setBubble(range,bubble);
  }

  setBubble(range, bubble) {
    const val = range.value;
    this.value = val;
    this.value1=0;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    this.price = val / 5;
    bubble.innerHTML = val;

    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${val * (30/30000) +1}vw)`;
    for(let i=0;i<this.smsPlan.length;i++)
    this.smsPlan[i].selected = false;
  }

  selectThisPlan(event:any,plan:any)
  { 
    for(let i=0;i<this.smsPlan.length;i++)
    {
      this.smsPlan[i].selected = false;
    }

    plan.selected = true;
    this.value1 = plan.price;
  }

  isPayButtonDisabled()
  {
    if(this.value >0 || this.value1 >0)return false;
    return true;
  }

}
