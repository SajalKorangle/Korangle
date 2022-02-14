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

    operation: string = "";  /* Add New  OR  Update  OR  Delete */

    statusName: string = "";

    constructor(
        public dialogRef: MatDialogRef<AddStatusModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.operation = data.operation;

        /* Initialize Data */
        if (this.operation == "Edit") {
            this.statusName = data.statusName;
        }
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    /* Close Modal */
    closeClicked() {
        this.dialogRef.close();
    }  // Ends: closeClicked()

    /* Save Modal */
    saveClicked() {
        if (!this.statusName) {
            alert("Please enter status name.");
            return;
        }

        this.dialogRef.close({statusName: this.statusName});
    }  // Ends: saveClicked()

    /* Delete Status */
    deleteClick() {
        this.dialogRef.close({operation: "delete"});
    }  // Ends: deleteClick()

    /* Map Bootstarp Color Name to Hex-Color Code */
    setCancelBtnStyle() {
        let color = "white";
        if (this.user.activeSchool.secondaryThemeColor == "primary") {
            color = "#1976D2";
        } else if (this.user.activeSchool.secondaryThemeColor == "warning") {
            color = "#FFC107";
        } else if (this.user.activeSchool.secondaryThemeColor == "secondary") {
            color = "#424242";
        } else if (this.user.activeSchool.secondaryThemeColor == "accent") {
            color = "#82B1FF";
        } else if (this.user.activeSchool.secondaryThemeColor == "error") {
            color = "#FF5252";
        } else if (this.user.activeSchool.secondaryThemeColor == "info") {
            color = "#2196F3";
        } else if (this.user.activeSchool.secondaryThemeColor == "success") {
            color = "#4CAF50";
        }

        let style = {
            'border': '1.5px solid ' + color,
        };

        return style;
    }  // Ends: setCancelBtnStyle()
}
