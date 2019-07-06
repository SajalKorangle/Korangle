import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import {PrintService} from "../../../../print/print-service";

@Component({
    templateUrl: './print-multiple-i-cards.component.html',
    styleUrls: ['./print-multiple-i-cards.component.css'],
})

export class PrintMultipleICardsComponent implements OnInit, OnDestroy, AfterViewChecked {

    user;

    viewChecked = true;

    studentProfileList: any;

    showClass = true;

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

    isLongScholarNumber(scholarNumber: any): boolean {
        if (scholarNumber.length > 13) {
            return true;
        }
        return false;
    }

}
