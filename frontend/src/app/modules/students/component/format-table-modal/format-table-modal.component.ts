import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-format-table-modal',
    templateUrl: './format-table-modal.component.html',
    styleUrls: ['./format-table-modal.component.css']
})
export class FormatTableModalComponent implements OnInit {
    name;

    constructor(
        public dialogRef: MatDialogRef<FormatTableModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.name = data.formatName;
    }

    ngOnInit() {
    }

    cancleClick(): void {
        this.dialogRef.close();
    }

    saveClick(): void {
        if(!this.name) {
            alert("Please enter the name.");
            return;
        }
        this.dialogRef.close({name: this.name});
    } 
}
