import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataStorage } from '@classes/data-storage';

@Component({
    selector: 'name-report-dialog',
    templateUrl: './name-report.dialog.html',
    styleUrls: ['./name-report.dialog.css']
})
export class NameReportDialog implements OnInit {
    user: any;
    name: string = "";
    reportList: any = [];
    isUnique: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<NameReportDialog>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.name = "";
        this.reportList = data.reportList;
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    /* Check Report Name Uniqueness */
    checkReportName() {
        let tempUniqueCount = 0;

        for (let idx = 0; idx < this.reportList.length; idx++) {
            if (this.reportList[idx].name.toString().trim() == this.name.toString().trim()) {
                tempUniqueCount++;
                break;
            }
        }

        if (tempUniqueCount > 0) {
            this.isUnique = false;
        } else {
            this.isUnique = true;
        }
    }  // Ends: checkReportName()

    /* Cancel Clicked */
    cancelClick(): void {
        this.dialogRef.close();
    }  // Ends: cancleClick()

    /* Save Button Clicked */
    saveClick(): void {
        if (!this.name.toString().trim()) {
            alert("Please enter the name.");
            return;
        }

        this.checkReportName();
        if (!this.isUnique) {
            alert("Report name must be unique.");
            return;
        }

        this.dialogRef.close({name: this.name.toString().trim()});
    }  // Ends: saveClick()
}
