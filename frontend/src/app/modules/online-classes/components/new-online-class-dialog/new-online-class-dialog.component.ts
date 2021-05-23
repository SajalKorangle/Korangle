import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-online-class-dialog',
  templateUrl: './new-online-class-dialog.component.html',
  styleUrls: ['./new-online-class-dialog.component.css']
})
export class NewOnlineClassDialogComponent implements OnInit {

  selectedClassSubject: number;
  meetingId: string = '';
  passCode: string = '';

  constructor(public dialogRef: MatDialogRef<NewOnlineClassDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    vm: any,
    weekday: string,
    timestamp: any,
    classSubjectList: Array<any>,
    onlineClassList: Array<any>,
  }
  ) { }

  ngOnInit() {
    console.log('this dialog: ', this);
  }

  handleSubjectSelection(classSubjectId) {
    const onlineClass = this.data.onlineClassList.find(onlineClass => onlineClass.parentClassSubject == classSubjectId);
    if (onlineClass && onlineClass.meetingNumber) {
      this.meetingId = onlineClass.meetingNumber;
      this.passCode = onlineClass.password;
    } else {
      this.meetingId = '';
      this.passCode = '';
    }
  }

  apply(): void {
    this.dialogRef.close({ parentClassSubject: this.selectedClassSubject, meetingId: this.meetingId, passCode: this.passCode });
  }

}
