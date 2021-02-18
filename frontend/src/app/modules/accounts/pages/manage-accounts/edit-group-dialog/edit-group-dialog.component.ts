import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-group-dialog',
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.css']
})
export class EditGroupDialogComponent implements OnInit {


  group: any;
  constructor(
    public dialogRef: MatDialogRef<EditGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {
      [key: string]: any,
     }) 
  { }

  ngOnInit() {
    this.group = this.data.group;
  }

  getHead() {
    return this.data.vm.headsList.find(head => head.id == this.group.parentHead);
  }

  assignGroup(group: any){
    if(group == null){
      this.group.parentGroup = null;
    }
    else{
      this.group.parentGroup = group.parentAccount;
      this.group.parentHead = group.parentHead;
    }
  }

  getGroup() {
    return this.data.vm.groupsList.find(group => group.parentAccount == this.group.parentGroup);
  }


  editGroup(){
    console.log(this.group);
    Promise.all([
      this.data.vm.accountsService.partiallyUpdateObject(this.data.vm.accountsService.account_session, this.group),
    ]).then(val =>{
      console.log(val);
      alert('Group Updated Successfully');
      this.dialogRef.close();
    })
  }

}
