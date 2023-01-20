import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { DataStorage } from '@classes/data-storage';


@Component({
    selector: 'app-data-loss-warning-modal',
    templateUrl: './data-loss-warning-modal.component.html',
    styleUrls: ['./data-loss-warning-modal.component.css']
})
export class DataLossWarningModalComponent implements OnInit {

    user: any;

    constructor(
        public dialogRef: MatDialogRef<DataLossWarningModalComponent>,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    // Starts :- Close Modal
    closeClicked() {
        this.dialogRef.close();
    }
    // Ends :- Close Modal

    // Starts :- Send user selected action
    sendAction(action: any) {
        let data = {};
        data["action"] = action;

        this.dialogRef.close(data);
    }
    // Ends :- Send user selected action

}