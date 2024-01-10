import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-guidelines-modal',
    templateUrl: './guidelines-modal.component.html',
    styleUrls: ['./guidelines-modal.component.css']
})
export class GuidelinesModalComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<GuidelinesModalComponent>,
    ) { }

    ngOnInit() { }

    /* Close Modal */
    closeClicked() {
        this.dialogRef.close();
    }  // Ends: closeClicked()

}