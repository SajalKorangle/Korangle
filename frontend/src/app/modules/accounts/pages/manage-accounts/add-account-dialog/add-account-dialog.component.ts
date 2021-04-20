import { Component, OnInit, Inject } from '@angular/core';
import { AddAccountDialogHtmlRenderer } from './add-account-dialog.html.renderer';
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

  htmlRenderer: AddAccountDialogHtmlRenderer;

  isLoading: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) 
    public data: {
        [key: string]: any,
     }) 
  { }

  ngOnInit() {
      this.htmlRenderer = new AddAccountDialogHtmlRenderer();
      this.htmlRenderer.initialize(this);
      this.initializeAccountVariables();
  }

  initializeAccountVariables(): void {
    this.openingBalance = 0;
    this.accountName = '';
    this.parentHead = null;
    this.parentGroup = null;
  }

  assignHeadFromGroup(){
    if(this.parentGroup == null){
      return ;
    }
    this.parentHead = this.data.vm.headsList.find(head => head.id == this.parentGroup.parentHead);
  }

  addAccount(): any{
    this.isLoading = true;
    if(this.openingBalance == null){
      this.openingBalance = 0;
    }
    let account_data = {
      parentSchool: this.data.vm.user.activeSchool.dbId,
      accountType: 'ACCOUNT',
      title: this.accountName,
    }
    Promise.all([
      this.data.vm.accountsService.createObject(this.data.vm.accountsService.accounts, account_data),
    ]).then(value =>{

      let account_session_data = {
        parentAccount: value[0].id,
        parentSession: this.data.vm.user.activeSchool.currentSessionDbId,
        openingBalance: this.openingBalance,
        parentGroup: null,
        parentHead : this.parentHead.id,
      }
      if(this.parentGroup != null){
        account_session_data.parentGroup = this.parentGroup.parentAccount;
      }
      Promise.all([
        this.data.vm.accountsService.createObject(this.data.vm.accountsService.account_session, account_session_data),
      ]).then(data =>{
        const customAccountSession = {...data[0], type: 'ACCOUNT', title: value[0].title}
        this.data.vm.accountsList.push(customAccountSession);
        this.data.vm.backendData.accountsList.push(value[0]);
        this.data.vm.serviceAdapter.initialiseDisplayData();
        alert('Account Created Successfully');
        this.initializeAccountVariables();
        this.isLoading = false;
      })

    })

  }

}
