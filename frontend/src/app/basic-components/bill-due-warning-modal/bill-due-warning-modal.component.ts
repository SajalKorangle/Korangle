import { Component, Inject, OnInit } from '@angular/core';
import { DataStorage } from '@classes/data-storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonFunctions } from '@classes/common-functions';

@Component({
    templateUrl: './bill-due-warning-modal.component.html',
    styleUrls: ['./bill-due-warning-modal.component.css'],
})
export class BillDueWarningModalComponent implements OnInit {
    
    user: any;

    constructor(
        public dialogRef: MatDialogRef<BillDueWarningModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    isMobile = CommonFunctions.getInstance().isMobileMenu;

    closeDialog(): void {
        this.dialogRef.close();
    }
}
