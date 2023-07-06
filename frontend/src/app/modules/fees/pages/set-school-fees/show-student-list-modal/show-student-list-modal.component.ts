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
    classList: any = [];
    sectionList: any = [];

    constructor(
        public dialogRef: MatDialogRef<ShowStudentListModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.studentList = data.studentList;
        this.classList = data.classList;
        this.sectionList = data.sectionList;
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    /* Close Clicked */
    closeClicked(): void {
        this.dialogRef.close();
    }  // Ends: closeClicked()

    getClassName(classDbId: number): string {
        return this.classList.find((classs) => {
            return classs.id == classDbId;
        }).name;
    }

    getSectionName(sectionDbId: number): string {
        return this.sectionList.find((section) => {
            return section.id == sectionDbId;
        }).name;
    }

}
