import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';

@Component({
    selector: 'app-print-i-cards',
    templateUrl: './print-i-cards.component.html',
    styleUrls: ['./print-i-cards.component.css'],
})
export class PrintICardsComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    viewChecked = true;

    studentProfileList: any;

    showClass = true;

    printMultipleIcards = false;

    printICardsComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }


    ngOnInit(): void {
        this.printICardsComponentSubscription = EmitterService.get('print-i-cards-component').subscribe( value => {
            this.studentProfileList = value.studentProfileList;
            this.viewChecked = false;
            this.showClass = value.showClass;
            this.printMultipleIcards = value.printMultipleIcards;
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
        this.printICardsComponentSubscription.unsubscribe();
        this.studentProfileList = null;
    }

}
