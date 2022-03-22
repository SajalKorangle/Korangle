import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataStorage } from '@classes/data-storage';

@Component({
    selector: 'app-show-complaint-list-modal',
    templateUrl: './show-complaint-list-modal.component.html',
    styleUrls: ['./show-complaint-list-modal.component.css']
})
export class ShowComplaintListModalComponent implements OnInit {
    user: any;
    complaintList: any = [];

    constructor(
        public dialogRef: MatDialogRef<ShowComplaintListModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.complaintList = data.complaintList;
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    /* Close Clicked */
    closeClicked(): void {
        this.dialogRef.close();
    }  // Ends: closeClicked()

}
