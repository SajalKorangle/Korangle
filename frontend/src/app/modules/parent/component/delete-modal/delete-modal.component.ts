import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

    user: any;
    name: string = "";

    constructor(
        public dialogRef: MatDialogRef<DeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.name = data.formatName;
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    /* Cancel Clicked */
    cancelClick(): void {
        this.dialogRef.close();
    }  // Ends: cancleClick()

    /* Save Button Clicked */
    deleteClick(): void {
        this.dialogRef.close({operation: "Delete"});
    }  // Ends: saveClick()
}
