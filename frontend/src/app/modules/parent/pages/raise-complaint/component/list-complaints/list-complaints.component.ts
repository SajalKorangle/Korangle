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

    /* Get Searched Complaint List */
    getSearchedComplaintList() {
        let searchedComplaintList = [];
        let searchString = this.searchString.trim();

        this.complaintList.forEach((complaint) => {
            if (complaint.parentStudent.name.toLowerCase().includes(searchString.toLowerCase())) { /* Check for student name */
                searchedComplaintList.push(complaint);
            } else if (complaint.title.toLowerCase().includes(searchString.toLowerCase())) { /* Check for complaint title */
                searchedComplaintList.push(complaint);
            } else if (
                complaint.parentSchoolComplaintType["name"] &&
                complaint.parentSchoolComplaintType.name.toLowerCase().includes(searchString.toLowerCase())
            ) { /* Check for complaint type */
                searchedComplaintList.push(complaint);
            }
        });

        return searchedComplaintList;
    }  // Ends: getSearchedComplaintList()

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
