import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-account-dialog',
  templateUrl: './add-account-dialog.component.html',
  styleUrls: ['./add-account-dialog.component.css']
})
export class AddAccountDialogComponent implements OnInit {

  accountName: any;
  parentGroup: any;
  parentHead: any;
  openingBalance: any;
  constructor(@Inject(MAT_DIALOG_DATA) 
    public data: {
        [key: string]: any,
     }) 
  { }

  ngOnInit() {
    this.openingBalance = 0;
    this.accountName = '';
    this.parentHead = null;
    this.parentGroup = null;
    console.log(this.data.vm.headsList);
  }

  assignHeadFromGroup(){
    if(this.parentGroup == null){
      return ;
    }
    this.parentHead = this.data.vm.headsList.find(head => head.id == this.parentGroup.parentHead);
  }

  addAccount():any{
    // console.log('added');
    // return ;
    if(this.openingBalance == null){
      this.openingBalance = 0;
    }
    let account_data = {
      parentSchool: this.data.vm.user.activeSchool.dbId,
      accountType: 'ACCOUNT',
      title: this.accountName,
    }
    console.log(account_data);
    Promise.all([
      this.data.vm.accountsService.createObject(this.data.vm.accountsService.accounts, account_data),
    ]).then(value =>{
      this.data.vm.serviceAdapter.accountsList.push(value[0]);

      let account_session_data = {
        parentAccount: value[0].id,
        parentSession: this.data.vm.user.activeSchool.currentSessionDbId,
        balance: this.openingBalance,
        parentGroup: null,
        parentHead : this.parentHead.id,
      }
      if(this.parentGroup != null){
        account_session_data.parentGroup = this.parentGroup.parentAccount;
      }
      console.log(account_session_data);
      Promise.all([
        this.data.vm.accountsService.createObject(this.data.vm.accountsService.account_session, account_session_data),
      ]).then(data =>{
        this.data.vm.serviceAdapter.accountsSessionList.push(data[0]);
        data[0]['type']='ACCOUNT';
        this.data.vm.accountsList.push(data[0]);
        this.data.vm.serviceAdapter.initialiseDisplayData();
        alert('Account Created Successfully');
        this.accountName = '';
        this.parentGroup = null;
        this.parentHead = null;
        this.openingBalance = 0;
        console.log(data);
      })

    })

  }

}
