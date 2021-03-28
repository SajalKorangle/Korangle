import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditAccountDialogHtmlRenderer } from './edit-account-dialog.html.renderer';

@Component({
  selector: 'app-edit-account-dialog',
  templateUrl: './edit-account-dialog.component.html',
  styleUrls: ['./edit-account-dialog.component.css']
})
export class EditAccountDialogComponent implements OnInit {

  account: any;
  isDeletable: any;

  htmlRenderer: EditAccountDialogHtmlRenderer;

  isLoading: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<EditAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {
      [key: string]: any,
     }) 
  { }

  ngOnInit() {
      this.account = this.data.account;
      this.htmlRenderer = new EditAccountDialogHtmlRenderer();
      this.htmlRenderer.initialize(this);
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


  editAccount() {
    this.isLoading = true;
    let account_session_update_data = {
      id: this.account.parentAccount,
      title: this.account.title,
    }
    Promise.all([
      this.data.vm.accountsService.partiallyUpdateObject(this.data.vm.accountsService.account_session, this.account), // 0
      this.data.vm.accountsService.partiallyUpdateObject(this.data.vm.accountsService.accounts, account_session_update_data), // 1
    ]).then(val => {
      const backendAccountIndex = this.data.vm.backendData.accountsList.findIndex(acc => acc.id == val[1].id);
      this.data.vm.backendData.accountsList[backendAccountIndex] = { ...this.data.vm.backendData.accountsList[backendAccountIndex], ...val[1]};

      const indexOfCustomAccountSession = this.data.vm.accountsList.findIndex(accountSession => accountSession.id == this.account.id);
      this.data.vm.accountsList[indexOfCustomAccountSession] = { ...this.account, ...val[0], title: val[1].title };

      this.data.vm.serviceAdapter.initialiseDisplayData();
      alert('Account Updated Successfully');
      // this.isLoading = false;
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
    this.isLoading = true;
    
    Promise.all([
      this.data.vm.accountsService.deleteObject(this.data.vm.accountsService.account_session, this.account),
    ]).then(val =>{
      for(let i=0;i<this.data.vm.accountsList.length ;i++){
        if(this.data.vm.accountsList[i].id == this.account.id){
          this.data.vm.accountsList.splice(i, 1);
          break;
        }
      }

      let account_session_data = {
        parentAccount: this.account.parentAccount,
      }
      Promise.all([
        this.data.vm.accountsService.getObjectList(this.data.vm.accountsService.account_session, account_session_data),
      ]).then(data =>{
        if(data[0].length == 0){
          let account_data = {
            id: this.account.parentAccount,
          }
          Promise.all([
            this.data.vm.accountsService.deleteObject(this.data.vm.accountsService.accounts, account_data),
          ]).then(value => {
            this.data.vm.backendData.accountsList = this.data.vm.backendData.accountsList.filter(acc => {return acc.id != value[0]});

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
