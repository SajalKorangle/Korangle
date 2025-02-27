import { Component, OnInit, Inject } from '@angular/core';
import { DataStorage } from "@classes/data-storage";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-edit-status-modal',
    templateUrl: './add-edit-status-modal.component.html',
    styleUrls: ['./add-edit-status-modal.component.css']
})
export class AddEditStatusModalComponent implements OnInit {
    user: any;

    operation: string = "";  /* Add New  OR  Update  OR  Delete */

    statusId: number = null;
    statusName: string = "";
    statusList: any = [];

    constructor(
        public dialogRef: MatDialogRef<AddEditStatusModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.operation = data.operation;
        this.statusList = data.statusList;

        /* Initialize Data */
        if (this.operation == "Edit") {
            this.statusName = data.statusName;
            this.statusId = data.statusId;
        }
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    /* Check Status Name Uniqueness */
    checkUniqueness() {
        let answer = true;
        this.statusList.forEach((status) => {
            if (status.name.toString().trim() == this.statusName.toString().trim() && status.id != this.statusId) {
                answer = false;
            }
        });
        return answer;
    }  // Ends: checkUniqueness()

    /* Close Modal */
    closeClicked() {
        this.dialogRef.close();
    }  // Ends: closeClicked()

    /* Save Modal */
    saveClicked() {
        if (!this.statusName.toString().trim()) {
            alert("Please enter status name.");
            return;
        }

        if (!this.checkUniqueness()) {
            alert("Status name must be unique.");
            return;
        }

        this.dialogRef.close({statusName: this.statusName.toString().trim()});
    }  // Ends: saveClicked()

    /* Delete Status */
    deleteClick() {
        this.dialogRef.close({operation: "delete"});
    }  // Ends: deleteClick()
}
