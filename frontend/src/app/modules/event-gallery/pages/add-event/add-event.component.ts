import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  
  user:any;
  
  selectionList=new FormControl();
  
  notifySelectionList:string[]=['None','Select All','Employees','All Students','Class 1','Class 2','Nursery','U.K.G','L.K.G']
  
  constructor() { }

  ngOnInit() {
    this.selectionList.setValue(this.notifySelectionList.slice(0,1));
  }

  handleSelectionChange(val:any) {
    console.log(val);
    if(val=='None'){
      this.selectionList.setValue(this.notifySelectionList.slice(0,1));
    }else if(val=='Select All') {
      this.selectionList.setValue(this.notifySelectionList.slice(1,2));
    }else if(val=='All Students') {
      this.selectionList.setValue(this.selectionList.value.filter(value=>{
        return !(value.startsWith('Class') || value.startsWith('N'))
      }));
    }else {
       this.selectionList.setValue(this.selectionList.value.filter(value=>{
        return !(value == "None" || value == "Select All");
      }));
    }
    console.log(this.selectionList.value);
  }
}
