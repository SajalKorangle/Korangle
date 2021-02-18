import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-account-dialog',
  templateUrl: './edit-account-dialog.component.html',
  styleUrls: ['./edit-account-dialog.component.css']
})
export class EditAccountDialogComponent implements OnInit {

  account: any;
  constructor(
    public dialogRef: MatDialogRef<EditAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {
      [key: string]: any,
     }) 
  { }

  ngOnInit() {
    this.account = this.data.account;
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
      console.log(val);
      alert('Account Updated Successfully');
      this.dialogRef.close();
    })
  }

}
