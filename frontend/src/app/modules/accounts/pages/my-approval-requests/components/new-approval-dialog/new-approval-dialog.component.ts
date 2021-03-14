import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-approval-dialog',
  templateUrl: './new-approval-dialog.component.html',
  styleUrls: ['./new-approval-dialog.component.css']
})
export class NewApprovalDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {
      [key: string]: any,
     }
  ) { }

  ngOnInit() {
  }

}
