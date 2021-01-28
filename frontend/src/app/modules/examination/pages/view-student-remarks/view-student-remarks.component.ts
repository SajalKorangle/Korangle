import { OnInit } from '@angular/core';
import { AddStudentRemarksComponent } from './../add-student-remarks/add-student-remarks.component';

export class ViewStudentRemarksComponent extends AddStudentRemarksComponent implements OnInit  {

  ngOnInit(): void{
    super.ngOnInit();
    this.htmlAdapter.editMode = false;
  }
}
