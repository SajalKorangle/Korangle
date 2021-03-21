import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddGroupDialogHtmlRenderer } from './add-group-dialog.html.renderer';

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrls: ['./add-group-dialog.component.css']
})
export class AddGroupDialogComponent implements OnInit {

  groupName: any;
  parentGroup: any;
  parentHead: any;

  htmlRenderer: AddGroupDialogHtmlRenderer;

  isLoading: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) 
    public data: {
        [key: string]: any,
     }) 
  { }

  ngOnInit() {
      this.htmlRenderer = new AddGroupDialogHtmlRenderer();
      this.htmlRenderer.initialize(this);
    this.groupName = '';
    this.parentGroup = null;
    this.parentHead = null;
  }


  assignHeadFromGroup(){
    if(this.parentGroup == null){
      return ;
    }
    this.parentHead = this.data.vm.headsList.find(head => head.id == this.parentGroup.parentHead);
  }

  addGroup(): any{
    this.isLoading = true;
    let group_data = {
      parentSchool: this.data.vm.user.activeSchool.dbId,
      accountType: 'GROUP',
      title: this.groupName,
    }
    console.log(group_data);
    Promise.all([
      this.data.vm.accountsService.createObject(this.data.vm.accountsService.accounts, group_data),
    ]).then(value =>{
      console.log(value);
      let group_session_data = {
        parentAccount: value[0].id,
        parentSession: this.data.vm.user.activeSchool.currentSessionDbId,
        openingBalance: 0,
        parentGroup: null,
        parentHead : this.parentHead.id,
      }
      if(this.parentGroup != null){
        group_session_data.parentGroup = this.parentGroup.parentAccount;
      }
      console.log(group_session_data);
      Promise.all([
        this.data.vm.accountsService.createObject(this.data.vm.accountsService.account_session, group_session_data),
      ]).then(data =>{
        data[0]['type'] = 'GROUP';
        const customAccount = { ...data[0], type: 'GROUP', title: value[0].title };
        this.data.vm.groupsList.push(customAccount);
        this.data.vm.serviceAdapter.initialiseDisplayData();
        alert('Group Created Successfully');
        this.groupName = '';
        this.parentGroup = null;
        this.parentHead = null;
        this.isLoading = false;
        console.log(data);
      })

    })

  }

}
