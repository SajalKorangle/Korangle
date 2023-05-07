import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AddReceiptBookServiceAdapter } from './add-receipt-book.service.adapter';
import { DataStorage } from '../../../../classes/data-storage';
import { GenericService } from '@services/generic/generic-service';

@Component({
    selector: 'add-receipt-book',
    templateUrl: './add-receipt-book.component.html',
    styleUrls: ['./add-receipt-book.component.css'],
    providers: [ GenericService ],
})
export class AddReceiptBookComponent implements OnInit {

    user;

    feeReceiptBookList = [];
    feeReceiptBookNameToBeAdded = '';
    feeReceiptBookReceiptNumberPrefixToBeAdded = '';

    serviceAdapter: AddReceiptBookServiceAdapter;

    isLoading = false;

    constructor(public genericService: GenericService, private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AddReceiptBookServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    isFeeReceiptBookUpdateDisabled(feeReceiptBook: any): boolean {
        if (
            (
                feeReceiptBook.newName == feeReceiptBook.name &&
                feeReceiptBook.newReceiptNumberPrefix == feeReceiptBook.receiptNumberPrefix &&
                feeReceiptBook.newActive == feeReceiptBook.active
            )
            || feeReceiptBook.updating) {
            return true;
        }
        return false;
    }
}
