import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-transactions.component.html',
    styleUrls: ['./print-transactions.component.css'],
})
export class PrintTransactionsListComponent implements OnInit, AfterViewChecked {

    @Input() user;

    transactionsList: any;
    startDate: any;
    endDate: any;
    columnFilter: any;

    viewChecked = true;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user; 
        this.transactionsList = value['transactionsList'];
        this.startDate = value['startDate'];
        this.endDate = value['endDate'];
        this.columnFilter = value['columnFilter'];
        this.viewChecked = false;
        console.log(this.transactionsList);
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.transactionsList = null;
            this.cdRef.detectChanges();
        }
    }

}
