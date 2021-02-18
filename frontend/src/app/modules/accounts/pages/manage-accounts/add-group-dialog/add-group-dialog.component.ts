import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrls: ['./add-group-dialog.component.css']
})
export class AddGroupDialogComponent implements OnInit {

  groupName: any;
  parentGroup: any;
  parentHead: any;
  constructor(@Inject(MAT_DIALOG_DATA) 
    public data: {
        [key: string]: any,
     }) 
  { }

  ngOnInit() {
    this.groupName = '';
    this.parentGroup = null;
    this.parentHead = null;
    console.log(this.data.vm.headsList);
    console.log(this.data.vm.accountsList);
    console.log(this.data.vm.groupsList);
  }


  assignHeadFromGroup(){
    if(this.parentGroup == null){
      return ;
    }
    this.parentHead = this.data.vm.headsList.find(head => head.id == this.parentGroup.parentHead);
  }

  addGroup():any{
    let group_data = {
      parentSchool: this.data.vm.user.activeSchool.dbId,
      accountType: 'GROUP',
    }
    console.log(group_data);
    Promise.all([
      this.data.vm.accountsService.createObject(this.data.vm.accountsService.accounts, group_data),
    ]).then(value =>{
      console.log(value);
      let group_session_data = {
        parentAccount: value[0].id,
        parentSession: this.data.vm.user.activeSchool.currentSessionDbId,
        title: this.groupName,
        balance: null,
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
        alert('Group Created Successfully');
        this.data.vm.groupsList.push(data[0]);
        this.groupName = null;
        this.parentGroup = null;
        this.parentHead = null;
        console.log(data);
      })

    })

  }

}
