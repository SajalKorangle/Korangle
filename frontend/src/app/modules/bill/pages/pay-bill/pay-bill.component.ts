import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GenericService } from '@services/generic/generic-service';
import { DataStorage } from "../../../../classes/data-storage";
import { PayBillServiceAdapter } from './pay-bill.service.adapter';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';

@Component({
    selector: 'pay-bill',
    templateUrl: './pay-bill.component.html',
    styleUrls: ['./pay-bill.component.css'],
    providers: [GenericService]
})

export class PayBillComponent implements OnInit {

    // @Input() user;
    user: any;
    serviceAdapter: PayBillServiceAdapter;

    // Loader List
    isInitialLoading: boolean;

    unpaidBillList = [];
    modeOfPaymentList = [];

    constructor(
        public dialog: MatDialog,
    ) { }

    // Server Handling - Initial
    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new PayBillServiceAdapter;
        this.serviceAdapter.initialiseAdapter(this);
        this.serviceAdapter.initialiseData();

    }

    openPaymentDialog(bill: any): any {
        const dialogRef = this.dialog.open(PaymentModalComponent, {
            minWidth: '50vw',
            minHeight: '50vh',
            data: {
                bill: bill,
                modeOfPaymentList: this.modeOfPaymentList,
            }
        });
    }

}