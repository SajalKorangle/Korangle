import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-format-table-modal',
    templateUrl: './format-table-modal.component.html',
    styleUrls: ['./format-table-modal.component.css']
})
export class FormatTableModalComponent implements OnInit {
    name: string = "";
    tableList: any = [];
    isUnique: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<FormatTableModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.name = data.formatName;
        this.tableList = data.tableList;
    }

    ngOnInit() { }

    /* Check Table Name Uniqueness */
    checkTableName() {
        let tempUniqueCount = 0;

        for (let idx = 0; idx < this.tableList.length; idx++) {
            if (this.tableList[idx].formatName.toString().trim() == this.name.toString().trim()) {
                tempUniqueCount++;
                break;
            }
        }

        if (tempUniqueCount > 0) {
            this.isUnique = false;
        } else {
            this.isUnique = true;
        }
    }  // Ends: checkTableName()

    /* Cancel Clicked */
    cancelClick(): void {
        this.dialogRef.close();
    }  // Ends: cancleClick()

    /* Save Button Clicked */
    saveClick(): void {
        if (!this.name.toString().trim()) {
            alert("Please enter the name.");
            return;
        }

        this.checkTableName();
        if (!this.isUnique) {
            alert("Table name must be unique.");
            return;
        }

        this.dialogRef.close({name: this.name.toString().trim()});
    }  // Ends: saveClick()
}
