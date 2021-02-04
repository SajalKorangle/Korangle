import { Component, OnInit } from '@angular/core';
import { School } from '../../../../services/modules/fees/models/schoolData'
import { Representative } from '../../../../services/modules/fees/models/representative'
import { Owner } from '../../../../services/modules/fees/models/owner'
import { DataStorage } from 'app/classes/data-storage';
import { FeeService } from 'app/services/modules/fees/fee.service';


@Component({
  selector: 'app-online-payment-account',
  templateUrl: './online-payment-account.component.html',
  styleUrls: ['./online-payment-account.component.css'],
  providers: [ FeeService ]
})
export class OnlinePaymentAccountComponent implements OnInit {

  user;

  //School data
  school = new School
  
  //Representative data
  representative = new Representative
  
  //Owner's data
  owner = new Owner


  constructor(public feeService: FeeService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
  }

  submitForm()
  {
    
    let data = {
      parentSchool : this.user.activeSchool.dbId,
      parentEmployee : this.user.activeSchool.employeeId,
      school : this.school,
      representative : this.representative,
      owner : this.owner
    }

    console.dir(data, {depth:null})

    this.feeService.createObject(this.feeService.online_payment_account,data).then(value => {
      console.log(value);
    })
  }

  

}
