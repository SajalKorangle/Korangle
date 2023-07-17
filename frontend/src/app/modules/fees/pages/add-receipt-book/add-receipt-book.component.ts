import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AddReceiptBookServiceAdapter } from './add-receipt-book.service.adapter';
import { DataStorage } from '../../../../classes/data-storage';
import { GenericService } from '@services/generic/generic-service';
import { AddReceiptBookHtmlRenderer } from './add-receipt-book.html.renderer';

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
    htmlRenderer: AddReceiptBookHtmlRenderer;

    isLoading = false;

    constructor(public genericService: GenericService, private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AddReceiptBookServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new AddReceiptBookHtmlRenderer();
        this.htmlRenderer.initializeAdapter(this);
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
