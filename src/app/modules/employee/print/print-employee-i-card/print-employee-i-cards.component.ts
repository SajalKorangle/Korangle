import {Component, OnInit, OnDestroy, AfterViewChecked, Input, ChangeDetectorRef} from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';

@Component({
    selector: 'app-print-employee-i-cards',
    templateUrl: './print-employee-i-cards.component.html',
    styleUrls: ['./print-employee-i-cards.component.css'],
})
export class PrintEmployeeICardsComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    viewChecked = true;

    employeeProfileList = [];

    printICardsComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }


    ngOnInit(): void {
        this.printICardsComponentSubscription = EmitterService.get('print-employee-i-cards-component').subscribe( value => {
            this.employeeProfileList = value;
            this.viewChecked = false;
        });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.employeeProfileList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printICardsComponentSubscription.unsubscribe();
        this.employeeProfileList = null;
    }

}
