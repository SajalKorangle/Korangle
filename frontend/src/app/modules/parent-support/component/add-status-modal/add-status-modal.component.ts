import { Component, OnInit, Inject } from '@angular/core';
import { DataStorage } from "@classes/data-storage";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-status-modal',
    templateUrl: './add-status-modal.component.html',
    styleUrls: ['./add-status-modal.component.css']
})
export class AddStatusModalComponent implements OnInit {
    user: any;

    operation: string = "";

    statusName: string = "";

    constructor(
        public dialogRef: MatDialogRef<AddStatusModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.operation = data.operation;

        if(this.operation == "Edit") {
            this.statusName = data.statusName;
        }
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

    closeClicked() {
        this.dialogRef.close();
    }

    saveClicked() {
        this.dialogRef.close({statusName: this.statusName});
    }
}
