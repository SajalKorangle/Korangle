import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-account-dialog',
  templateUrl: './edit-account-dialog.component.html',
  styleUrls: ['./edit-account-dialog.component.css']
})
export class EditAccountDialogComponent implements OnInit {

  account: any;
  isDeletable: any;
  constructor(
    public dialogRef: MatDialogRef<EditAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {
      [key: string]: any,
     }) 
  { }

  ngOnInit() {
    this.account = this.data.account;
    this.isAccountDeletable();
  }

  getHead() {
    return this.data.vm.headsList.find(head => head.id == this.account.parentHead);
  }

  assignGroup(group: any){
    if(group == null){
      this.account.parentGroup = null;
    }
    else{
      this.account.parentGroup = group.parentAccount;
      this.account.parentHead = group.parentHead;
    }
  }

  getGroup() {
    return this.data.vm.groupsList.find(group => group.parentAccount == this.account.parentGroup);
  }


  editAccount(){
    let account_session_update_data = {
      id: this.account.parentAccount,
      title: this.account.title,
    }
    console.log(this.account);
    Promise.all([
      this.data.vm.accountsService.partiallyUpdateObject(this.data.vm.accountsService.account_session, this.account),
      this.data.vm.accountsService.partiallyUpdateObject(this.data.vm.accountsService.accounts, account_session_update_data),
    ]).then(val =>{
      console.log(val);
      this.account = { ...this.account, ...val[0] };
      for(let i=0;i<this.data.vm.accountsList.length ;i++){
        if(this.data.vm.accountsList[i].id == this.account.id){
          this.data.vm.accountsList[i].title = this.account.title;
          this.data.vm.accountsList[i].parentHead = this.account.parentHead;
          this.data.vm.accountsList[i].parentGroup = this.account.parentGroup;
          this.data.vm.accountsList[i].openingBalance = this.account.openingBalance;
          this.data.vm.accountsList[i].currentBalance = this.account.currentBalance;
          break;
        }
      }
      
      for(let i=0;i<this.data.vm.serviceAdapter.accountsSessionList.length ;i++){
        if(this.data.vm.serviceAdapter.accountsSessionList[i].id == this.account.id){
          this.data.vm.serviceAdapter.accountsSessionList[i].title = this.account.title;
          this.data.vm.serviceAdapter.accountsSessionList[i].parentHead = this.account.parentHead;
          this.data.vm.serviceAdapter.accountsSessionList[i].parentGroup = this.account.parentGroup;
          this.data.vm.serviceAdapter.accountsSessionList[i].balance = this.account.balance;
          break;
        }
      }
      this.data.vm.serviceAdapter.initialiseDisplayData();
      console.log(val);
      alert('Account Updated Successfully');
      this.dialogRef.close();
    })
  }

  isAccountDeletable(){
    let data = {
      parentAccount: this.account.parentAccount,
      parentTransaction__transactionDate__lte: this.data.vm.maximumDate,
      parentTransaction__transactionDate__gte: this.data.vm.minimumDate,
      korangle__count: '0,1',
    }
    
    Promise.all([
      this.data.vm.accountsService.getObjectList(this.data.vm.accountsService.transaction_account_details, data),
    ]).then(val =>{
      console.log(val);
      if(val[0].length  == 0){
        this.isDeletable = true;
      }
      else{
        this.isDeletable = false;
      }
    })

  }

  deleteAccount(){
    if(!confirm('Are you sure you want to delete this account?')){
      return ;
    }
    
    console.log(this.account);
    Promise.all([
      this.data.vm.accountsService.deleteObject(this.data.vm.accountsService.account_session, this.account),
    ]).then(val =>{
      for(let i=0;i<this.data.vm.accountsList.length ;i++){
        if(this.data.vm.accountsList[i].id == this.account.id){
          this.data.vm.accountsList.splice(i, 1);
          break;
        }
      }
      for(let i=0;i<this.data.vm.serviceAdapter.accountsSessionList.length ;i++){
        if(this.data.vm.serviceAdapter.accountsSessionList[i].id == this.account.id){
          this.data.vm.serviceAdapter.accountsSessionList.splice(i, 1);
          break;
        }
      }
      let account_session_data = {
        parentAccount: this.account.parentAccount,
      }
      Promise.all([
        this.data.vm.accountsService.getObjectList(this.data.vm.accountsService.account_session,account_session_data),
      ]).then(data =>{
        if(data[0].length > 0){
          let account_data = {
            id: this.account.parentAccount,
          }
          Promise.all([
            this.data.vm.accountsService.deleteObject(this.data.vm.accountsService.accounts, account_data),
          ]).then(value =>{
            this.data.vm.serviceAdapter.initialiseDisplayData();
            alert('Account Deleted Successfully');
            this.dialogRef.close();

          })
        }
        else{
            this.data.vm.serviceAdapter.initialiseDisplayData();
            alert('Account Deleted Successfully');
            this.dialogRef.close();
        }
      })
    })
  }

}
