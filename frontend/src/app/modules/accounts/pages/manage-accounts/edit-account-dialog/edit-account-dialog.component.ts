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
    console.log(this.account);
    Promise.all([
      this.data.vm.accountsService.partiallyUpdateObject(this.data.vm.accountsService.account_session, this.account),
    ]).then(val =>{
      
      for(let i=0;i<this.data.vm.accountsList.length ;i++){
        if(this.data.vm.groupsList[i].id == this.account.id){
          this.data.vm.groupsList[i].title = this.account.title;
          this.data.vm.groupsList[i].parentHead = this.account.parentHead;
          this.data.vm.groupsList[i].parentGroup = this.account.parentGroup;
          break;
        }
      }
      
      for(let i=0;i<this.data.vm.serviceAdapter.accountsSessionList.length ;i++){
        if(this.data.vm.serviceAdapter.accountsSessionList[i].id == this.account.id){
          this.data.vm.serviceAdapter.accountsSessionList[i].title = this.account.title;
          this.data.vm.serviceAdapter.accountsSessionList[i].parentHead = this.account.parentHead;
          this.data.vm.serviceAdapter.accountsSessionList[i].parentGroup = this.account.parentGroup;
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
      this.data.vm.serviceAdapter.initialiseDisplayData();

      console.log(val);
      alert('Account Deleted Successfully');
      this.dialogRef.close();
    })
  }

}
