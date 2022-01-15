import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'app-format-table-modal',
    templateUrl: './format-table-modal.component.html',
    styleUrls: ['./format-table-modal.component.css']
})
export class FormatTableModalComponent implements OnInit {
    user: any;
    name: string = "";

    constructor(
        public dialogRef: MatDialogRef<FormatTableModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.name = data.formatName;
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

    /* Cancel Clicked */
    cancelClick(): void {
        this.dialogRef.close();
    }  // Ends: cancleClick()

    /* Save Button Clicked */
    saveClick(): void {
        if (!this.name) {
            alert("Please enter the name.");
            return;
        }
        this.dialogRef.close({name: this.name});
    }  // Ends: saveClick()
}
