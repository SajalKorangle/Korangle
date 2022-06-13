import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataStorage } from '@classes/data-storage';
import { ShowComplaintListModalHtmlRenderer } from './show-complaint-list-modal.html.renderer';

@Component({
    selector: 'app-show-complaint-list-modal',
    templateUrl: './show-complaint-list-modal.component.html',
    styleUrls: ['./show-complaint-list-modal.component.css']
})
export class ShowComplaintListModalComponent implements OnInit {
    user: any;

    complaintList: any = [];
    statusList: any = [];
    complaintTypeList: any = [];
    studentList: any = [];

    htmlRenderer: ShowComplaintListModalHtmlRenderer;

    constructor(
        public dialogRef: MatDialogRef<ShowComplaintListModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.complaintList = data.complaintList;
        this.statusList = data.statusList;
        this.complaintTypeList = data.complaintTypeList;
        this.studentList = data.studentList;
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new ShowComplaintListModalHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Close Clicked */
    closeClicked(): void {
        this.dialogRef.close();
    }  // Ends: closeClicked()

}
