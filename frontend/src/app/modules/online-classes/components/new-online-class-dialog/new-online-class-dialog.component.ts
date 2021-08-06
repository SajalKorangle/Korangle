import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SettingsComponent } from '@modules/online-classes/pages/set-time-table/settings.component';
import { TimeSpan, ParsedOnlineClass, TimeComparator } from '@modules/online-classes/class/constants';
import { ClassSubject } from '@services/modules/subject/models/class-subject';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonFunctions } from '@classes/common-functions';

@Component({
  selector: 'app-new-online-class-dialog',
  templateUrl: './new-online-class-dialog.component.html',
  styleUrls: ['./new-online-class-dialog.component.css']
})
export class NewOnlineClassDialogComponent implements OnInit {

  parentClassSubject: number;

  filteredClassSubject: Array<ClassSubject>;

  isPasswordVisible: boolean = false;

  commonFunctions = CommonFunctions.getInstance();

  constructor(public dialogRef: MatDialogRef<NewOnlineClassDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    vm: SettingsComponent,
    weekday: string,
    timeSpan: TimeSpan,
    onlineClass: ParsedOnlineClass,
  },
    public snackBar: MatSnackBar
  ) {
    this.filteredClassSubject = data.vm.backendData.classSubjectList.filter(classSubject => {
      if (classSubject.parentClass == data.vm.userInput.selectedClass.id
        && classSubject.parentDivision == data.vm.userInput.selectedSection.id)
        return true;
      return false;
    });
    if (data.onlineClass) {
      this.parentClassSubject = data.onlineClass.parentClassSubject;
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

  isOccupied(classSubject: ClassSubject): boolean {
    const parentEmployee = classSubject.parentEmployee;

    const bookedSlotOnlineClass = this.data.vm.backendData.onlineClassList.find(onlineClass => {
      const classSubject = this.data.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
      if (classSubject.parentEmployee != parentEmployee) {
        return false;
      }
      if (classSubject.parentClass == this.data.vm.userInput.selectedClass.id) {
        return false;
      }
      if (this.data.weekday == onlineClass.day
        && TimeComparator(this.data.timeSpan.startTime, onlineClass.endTimeJSON) < 0
        && TimeComparator(onlineClass.startTimeJSON, this.data.timeSpan.endTime) < 0) {
        return true;
      }
    });

    return Boolean(bookedSlotOnlineClass);
  }

  apply(): void {
    this.dialogRef.close({ parentClassSubject: this.parentClassSubject, });
  }

}
