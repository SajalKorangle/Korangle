import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { MatDialog } from '@angular/material';

import { OpenComplaintHtmlRenderer } from './open-complaint.html.renderer';


@Component({
    selector: 'app-open-complaint',
    templateUrl: './open-complaint.component.html',
    styleUrls: ['./open-complaint.component.css']
})
export class OpenComplaintComponent implements OnInit {
    @Input() user;
    @Input() defaultStatusTitle;
    @Input() openedComplaint;
    @Input() commentList;
    @Input() commentMessage;
    @Output() changePageName = new EventEmitter<string>();
    @Output() initializeComplaintData = new EventEmitter<any>();
    @Output() updateStatus = new EventEmitter<any>();
    @Output() deleteComplaint = new EventEmitter<any>();
    @Output() refreshComplaint = new EventEmitter<any>();
    @Output() updateComplaintClicked = new EventEmitter<any>();
    @Output() renotifyComplaint = new EventEmitter<any>();

    htmlRenderer: OpenComplaintHtmlRenderer;


    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.htmlRenderer = new OpenComplaintHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    changePage() {
        this.changePageName.emit("list-of-complaints");
    }

    triggerInitializeComplaintData() {
        this.initializeComplaintData.emit();
    }

    triggerUpdateStatus(status) {
        let response = [];
        response.push(this.commentMessage);
        response.push(status);

        this.updateStatus.emit(response);
    }

    triggerDeleteComplaint(complaint) {
        let response = [];
        response.push("");
        response.push(complaint);

        this.deleteComplaint.emit(response);
    }

    triggerRefreshClicked() {
        this.refreshComplaint.emit();
    }

    triggerUpdateComplaintClicked() {
        if (!this.commentMessage.toString().trim()) {
            alert("Please enter your query.");
            return;
        }
        this.updateComplaintClicked.emit(this.commentMessage);
    }

    triggerRenotifyClicked() {
        this.renotifyComplaint.emit();
    }
}
