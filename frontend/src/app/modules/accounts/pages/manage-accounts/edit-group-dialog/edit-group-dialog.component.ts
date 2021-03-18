import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-group-dialog',
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.css']
})
export class EditGroupDialogComponent implements OnInit {


  group: any;
  isLoading: boolean = false;
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

  findGroupHierarchy(root) { // dfs on hierarchy structure
    if (root.type == "ACCOUNT")
      return null;
    if (root.id == this.group.id)
      return root;
    let group = null;
    root.childs.every(g => {
      if (g.type = "GROUP") {
        group = this.findGroupHierarchy(g);
        if (group) {
          return false;
        }
      }
      return true;
    });
    return group;
  }

  enumAllChilds(group): Array<number> {
    if (group.type == "ACCOUNT")
      return [];
    let allchildIds = [];
    group.childs.forEach(g => {
      if (g.type == "GROUP") {
        allchildIds.push(g.id);
        allchildIds.push(...this.enumAllChilds(g));
      }
    });
    return allchildIds;
  }

  getFilteredGroupList(): Array<any> {
    const headTitle = this.getHead().title;
    let filteredGroup =  this.data.vm.groupsList.filter(group => group.id != this.group.id);
    let groupStructure;
    this.data.vm.hierarchyStructure[headTitle].every(g => {
      groupStructure = this.findGroupHierarchy(g);
      if (groupStructure) {
        return false;
      }
      return true;
    });
    let allChildIds = this.enumAllChilds(groupStructure);
    return filteredGroup.filter(g => allChildIds.find(c => c == g.id) == undefined);
  }


  editGroup(){
    this.isLoading = true;
    let group_session_update_data = {
      id: this.group.parentAccount,
      title: this.group.title,
    }
    console.log(this.group);
    Promise.all([
      this.data.vm.accountsService.partiallyUpdateObject(this.data.vm.accountsService.account_session, this.group),
      this.data.vm.accountsService.partiallyUpdateObject(this.data.vm.accountsService.accounts, group_session_update_data),
    ]).then(val => {
      
      const indexOfCustomGroupSessin = this.data.vm.groupsList.findIndex(groupSession => groupSession.id == this.group.id);
      this.data.vm.groupssList[indexOfCustomGroupSessin] = { ...this.group, ...val[0],  title: val[1].title };

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
    this.isLoading = true;
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

      this.data.vm.serviceAdapter.initialiseDisplayData();
      alert('Group Deleted Successfully');
      this.dialogRef.close();
    })
  }

  isGroupDeletable(): boolean{
    if(this.group.childs.length == 0){
      return true;
    }
    return false;
  }

}
