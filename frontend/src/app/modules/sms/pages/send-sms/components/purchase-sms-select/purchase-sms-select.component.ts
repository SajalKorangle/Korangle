import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SendSmsComponent } from '@modules/sms/pages/send-sms/send-sms.component';
import { PurchaseSmsDialogComponent } from '../purchase-sms-dialog/purchase-sms-dialog.component';
import { PurchaseSmsDialogEasebuzzComponent } from '../purchase-sms-dialog-easebuzz/purchase-sms-dialog-easebuzz.component';


@Component({
    selector: 'app-purchase-sms-select',
    templateUrl: './purchase-sms-select.component.html',
    styleUrls: ['./purchase-sms-select.component.css']
})
export class PurchaseSmsSelectComponent implements OnInit {
    vm: SendSmsComponent;

    constructor(
        public dialogRef: MatDialogRef<PurchaseSmsSelectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { vm: SendSmsComponent; }
    ) {
        this.vm = data.vm;
    }

    ngOnInit() {
    }
    
    closeDialog(): void {
        this.dialogRef.close();
    }

    openCashfree(): void {
        this.vm.dialog.open(PurchaseSmsDialogComponent, { data: { vm: this.vm } })
        this.closeDialog();
    }

    openEaseBuzz(): void {
        this.vm.dialog.open(PurchaseSmsDialogEasebuzzComponent, { data: { vm: this.vm } })
        this.closeDialog();
    }

}
