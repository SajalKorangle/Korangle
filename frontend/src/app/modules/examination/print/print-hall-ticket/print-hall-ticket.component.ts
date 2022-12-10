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

    sessionList: any;

    opacity: any;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user;
        this.studentList = value.studentList;
        this.examination = value.examination;
        this.boardList = value.boardList;
        this.opacity = {
            opacity: this.user.activeSchool.opacity,
        };
        (this.showPrincipalSignature = value.showPrincipalSignature), (this.viewChecked = false);
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
        return this.sessionList.find(session => {
            return session.id == sessionId;
        }).name;
    }
}
