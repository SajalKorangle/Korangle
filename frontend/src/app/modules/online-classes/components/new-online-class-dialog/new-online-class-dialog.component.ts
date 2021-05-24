import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SettingsComponent } from '@modules/online-classes/pages/settings/settings.component';
import { TimeSpan, ParsedOnlineClass } from '@modules/online-classes/class/constants';

@Component({
  selector: 'app-new-online-class-dialog',
  templateUrl: './new-online-class-dialog.component.html',
  styleUrls: ['./new-online-class-dialog.component.css']
})
export class NewOnlineClassDialogComponent implements OnInit {

  parentClassSubject: number;
  meetingNumber: number;
  password: string = '';

  filteredClassSubject: Array<any>;

  constructor(public dialogRef: MatDialogRef<NewOnlineClassDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    vm: SettingsComponent,
    weekday: string,
    timespan: TimeSpan,
    onlineClass: ParsedOnlineClass,
  }
  ) {
    this.filteredClassSubject = data.vm.backendData.classSubjectList.filter(classSubject => {
      if (classSubject.parentClass == data.vm.userInput.selectedClass.id
        && classSubject.parentDivision == data.vm.userInput.selectedSection.id)
        return true;
      return false;
    });
    if (data.onlineClass) {
      this.parentClassSubject = data.onlineClass.parentClassSubject;
      this.meetingNumber = data.onlineClass.meetingNumber;
      this.password = data.onlineClass.password;
    }
  }

  ngOnInit() {
    // console.log('this dialog: ', this);
  }

  getAccountInfoForSelectedSubject() {
    if (!this.parentClassSubject)
      return;
    const classSubject = this.filteredClassSubject.find(cs => cs.id == this.parentClassSubject);
    return this.data.vm.backendData.accountInfoList.find(accountInfo => accountInfo.parentEmployee == classSubject.parentEmployee);
  }

  apply(): void {
    this.dialogRef.close({ parentClassSubject: this.parentClassSubject, meetingNumber: this.meetingNumber, password: this.password });
  }

}
