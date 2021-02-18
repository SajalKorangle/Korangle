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
    let account_data = {
      parentSchool: this.data.vm.user.activeSchool.dbId,
      accountType: 'ACCOUNT',
    }
    console.log(account_data);
    Promise.all([
      this.data.vm.accountsService.createObject(this.data.vm.accountsService.accounts, account_data),
    ]).then(value =>{
      let account_session_data = {
        parentAccount: value[0].id,
        parentSession: this.data.vm.user.activeSchool.currentSessionDbId,
        title: this.accountName,
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
        alert('Account Created Successfully');
        this.accountName = null;
        this.parentGroup = null;
        this.parentHead = null;
        console.log(data);
      })

    })

  }

}
