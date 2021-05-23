import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SettingsComponent } from '@modules/online-classes/pages/settings/settings.component';
import { TimeSpan } from '@modules/online-classes/class/constants';

@Component({
  selector: 'app-new-online-class-dialog',
  templateUrl: './new-online-class-dialog.component.html',
  styleUrls: ['./new-online-class-dialog.component.css']
})
export class NewOnlineClassDialogComponent implements OnInit {

  parentAccountInfo: number;
  parentClassSubject: number;
  meetingNumber: string = '';
  password: string = '';

  filteredClassSubject: Array<any>;

  constructor(public dialogRef: MatDialogRef<NewOnlineClassDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    vm: SettingsComponent,
    weekday: string,
    timespan: TimeSpan,
  }
  ) {
    this.filteredClassSubject = data.vm.backendData.classSubjectList.filter(classSubject => {
      if (classSubject.parentClass == data.vm.userInput.selectedClass.id
        && classSubject.parentDivision == data.vm.userInput.selectedSection.id)
        return true;
      return false;
    });
  }

  ngOnInit() {
    console.log('this dialog: ', this);
  }

  apply(): void {
    this.dialogRef.close({ parentClassSubject: this.parentClassSubject, parentAccountInfo: this.parentAccountInfo, meetingNumber: this.meetingNumber, password: this.password });
  }

}
