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
      for(let i=0;i<this.data.vm.groupsList.length ;i++){
        if(this.data.vm.groupsList[i].id == this.group.id){
          this.data.vm.groupsList[i].title = this.group.title;
          this.data.vm.groupsList[i].parentHead = this.group.parentHead;
          this.data.vm.groupsList[i].parentGroup = this.group.parentGroup;
          break;
        }
      }
      
      for(let i=0;i<this.data.vm.serviceAdapter.accountsSessionList.length ;i++){
        if(this.data.vm.serviceAdapter.accountsSessionList[i].id == this.group.id){
          this.data.vm.serviceAdapter.accountsSessionList[i].title = this.group.title;
          this.data.vm.serviceAdapter.accountsSessionList[i].parentHead = this.group.parentHead;
          this.data.vm.serviceAdapter.accountsSessionList[i].parentGroup = this.group.parentGroup;
          break;
        }
      }
      this.data.vm.serviceAdapter.initialiseDisplayData();
      console.log(val);
      alert('Group Updated Successfully');
      this.dialogRef.close();
    })
  }

  deleteGroup(){
    if(!confirm('Are you sure you want to delete this group')){
      return ;
    }
    console.log(this.group);
    Promise.all([
      this.data.vm.accountsService.deleteObject(this.data.vm.accountsService.account_session, this.group),
    ]).then(val =>{
      console.log(val);
      
      for(let i=0;i<this.data.vm.groupsList.length ;i++){
        if(this.data.vm.groupsList[i].id == this.group.id){
          this.data.vm.groupsList.splice(i, 1);
          break;
        }
      }
      for(let i=0;i<this.data.vm.serviceAdapter.accountsSessionList.length ;i++){
        if(this.data.vm.serviceAdapter.accountsSessionList[i].id == this.group.id){
          this.data.vm.serviceAdapter.accountsSessionList.splice(i, 1);
          break;
        }
      }
      this.data.vm.serviceAdapter.initialiseDisplayData();
      alert('Group Deleted Successfully');
      this.dialogRef.close();
    })
  }

  isGroupDeletable(): boolean{
    if(this.group.childs == undefined || this.group.childs.length == 0){
      return true;
    }
    return false;
  }

  

}
