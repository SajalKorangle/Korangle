import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { MatDialog } from '@angular/material';

import { ListComplaintsHtmlRenderer } from './list-complaints.html.renderer';


@Component({
    selector: 'app-list-complaints',
    templateUrl: './list-complaints.component.html',
    styleUrls: ['./list-complaints.component.css']
})
export class ListComplaintsComponent implements OnInit {
    @Input() user;
    @Input() complaintList;
    @Output() openComplaint = new EventEmitter<any>();
    @Output() deleteComplaint = new EventEmitter<any>();
    @Output() changePageName = new EventEmitter<string>();

    searchString: string = "";

    htmlRenderer: ListComplaintsHtmlRenderer;


    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.htmlRenderer = new ListComplaintsHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Open Complaint */
    triggerOpenComplaint(complaint) {
        this.openComplaint.emit(complaint);
    }  // Ends: triggerOpenComplaint()

    /* Delete Complaint */
    triggerDeleteComplaint(complaint) {
        this.deleteComplaint.emit(complaint);
    }  // Ends: triggerDeleteComplaint()

    /* Change Page */
    changePage() {
        this.changePageName.emit("send-complaint");
    }  // Ends: changePage()
}
