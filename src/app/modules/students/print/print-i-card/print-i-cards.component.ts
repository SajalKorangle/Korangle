import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-i-cards.component.html',
    styleUrls: ['./print-i-cards.component.css'],
})
export class PrintICardsComponent implements OnInit, OnDestroy, AfterViewChecked {

    user: any;

    viewChecked = true;

    studentProfileList: any;

    showClass = true;

    printICardsComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }

    ngOnInit(): void {
        const {user, value}  = this.printService.getData();
        this.user = user;
        this.studentProfileList = value.studentProfileList;
        this.viewChecked = false;
        this.showClass = value.showClass;
        
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            
            this.studentProfileList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.studentProfileList = null;
    }

}
