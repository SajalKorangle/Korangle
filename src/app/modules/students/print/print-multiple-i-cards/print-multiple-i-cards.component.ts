import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';

@Component({
    selector: 'app-print-multiple-i-cards',
    templateUrl: './print-multiple-i-cards.component.html',
    styleUrls: ['./print-multiple-i-cards.component.css'],
})

export class PrintMultipleICardsComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    viewChecked = true;

    studentProfileList: any;

    showClass = true;

    printMultipleICardsComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }


    ngOnInit(): void {
        this.printMultipleICardsComponentSubscription = EmitterService.get('print-multiple-i-cards-component').subscribe(value => {
            this.studentProfileList = value.studentProfileList;
            this.viewChecked = false;
            this.showClass = value.showClass;
        });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.studentProfileList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printMultipleICardsComponentSubscription.unsubscribe();
        this.studentProfileList = null;
    }

}
