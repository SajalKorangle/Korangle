import {Component, OnInit, OnDestroy, AfterViewChecked, Input, ChangeDetectorRef} from '@angular/core';

import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-employee-i-cards.component.html',
    styleUrls: ['./print-employee-i-cards.component.css'],
})
export class PrintEmployeeICardsComponent implements OnInit, OnDestroy, AfterViewChecked {

    user: any;

    viewChecked = true;

    employeeProfileList = [];

    printICardsComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user;
        this.employeeProfileList = value;
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.employeeProfileList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.employeeProfileList = null;
    }

}
