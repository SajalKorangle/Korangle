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

    ngOnInit() {
    }

    /* Debouncing */
    debounce(func, timeout = 100) {
        let timer;
        return (...args) => {
        clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
         };
    }  // Ends: debounce()

    /* Apply Filters */
    checkTableName() {
        let tempUniqueCount = 0;

        for (let idx = 0; idx < this.tableList.length; idx++) {
            if (this.tableList[idx].formatName == this.name) {
                tempUniqueCount++;
                break;
            }
        }

        if (tempUniqueCount > 0) {
            this.isUnique = false;
        } else {
            this.isUnique = true;
        }
    }  // Ends: applyFilters()

    nameChanged = this.debounce(() => this.checkTableName());

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

        if (!this.isUnique) {
            return;
        }

        this.dialogRef.close({name: this.name});
    }  // Ends: saveClick()
}
