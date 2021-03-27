import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-ledger.component.html',
    styleUrls: ['./print-ledger.component.css'],
})
export class PrintLedgerComponent implements OnInit, AfterViewChecked {

    @Input() user;

    transactionsList: any;
    account: any;
    columnFilter: any;

    viewChecked = true;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user; 
        this.transactionsList = value['transactionsList'];
        this.account = value['account'];
        this.columnFilter = value['columnFilter'];
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.cdRef.detectChanges();
        }
    }

    getDisplayDateFormat(str :any){
        // return str;
        let d = new Date(str);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();
  
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
  
        return [day, month, year].join('/');
      }

    getCurrentBalance(balance:any) {
        return balance<0?balance.split('-')[1]+" (-ve)":balance;
    }
}
