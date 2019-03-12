import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';

@Component({
    selector: 'app-print-hall-ticket',
    templateUrl: './print-hall-ticket.component.html',
    styleUrls: ['./print-hall-ticket.component.css'],
})
export class PrintHallTicketComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    viewChecked = true;

    studentList: any;
    examination: any;

    opacity: any;

    printHallTicketComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.printHallTicketComponentSubscription =
            EmitterService.get('print-hall-ticket-component').subscribe(value => {
            console.log(value);
            this.studentList = value.studentList;
            this.examination = value.examination;
            this.opacity = {
                opacity: this.user.activeSchool.opacity,
            };
            this.viewChecked = false;
        });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.studentList = null;
            this.examination = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printHallTicketComponentSubscription.unsubscribe();
        this.studentList = null;
        this.examination = null;
    }

    getSessionName(sessionId: any): any {
        let result = '';
        switch(sessionId) {
            case 1:
                result = 'Session 2017-18';
                break;
            case 2:
                result = 'Session 2018-19';
                break;
            case 3:
                result = 'Session 2019-20';
                break;
        }
        return result;
    }

}
