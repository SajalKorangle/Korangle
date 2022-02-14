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

    getCancelBtnStyle() {
        let style = {};

        let color = "";
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

        style["padding"] = "7px 17px";
        style["color"] = color;
        style["font-weight"] = "500";
        return style;
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
