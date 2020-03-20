import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-hall-ticket.component.html',
    styleUrls: ['./print-hall-ticket.component.css'],
})
export class PrintHallTicketComponent implements OnInit, OnDestroy, AfterViewChecked {

    user: any;

    viewChecked = true;

    studentList: any;
    examination: any;
    showPrincipalSignature: any;

    boardList: any;

    opacity: any;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user;
        this.studentList = value.studentList;
        this.examination = value.examination;
        this.boardList = value.boardList;
        this.opacity = {
            opacity: this.user.activeSchool.opacity,
        };
        this.showPrincipalSignature = value.showPrincipalSignature,
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.studentList = null;
            this.examination = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
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
