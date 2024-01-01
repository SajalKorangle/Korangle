import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataStorage } from '@classes/data-storage';

@Component({
    selector: 'app-show-student-list-modal',
    templateUrl: './show-student-list-modal.component.html',
    styleUrls: ['./show-student-list-modal.component.css']
})
export class ShowStudentListModalComponent implements OnInit {
    user: any;
    studentList: any = [];
    headerValue = "";

    constructor(
        public dialogRef: MatDialogRef<ShowStudentListModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.studentList = data.studentList;
        this.headerValue = data.headerValue;
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    /* Close Clicked */
    closeClicked(): void {
        this.dialogRef.close();
    }  // Ends: closeClicked()

}
