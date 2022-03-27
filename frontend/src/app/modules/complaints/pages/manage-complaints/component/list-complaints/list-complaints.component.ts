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
    @Input() progress;
    @Input() isLoadMore;
    @Input() filterComplaintTypeList;
    @Input() filterStatusList;
    @Input() searchedComplaintList;
    @Output() searchComplaints = new EventEmitter<any>();
    @Output() doneIconClicked = new EventEmitter<any>();
    @Output() sortNewestClicked = new EventEmitter<any>();
    @Output() sortOldestClicked = new EventEmitter<any>();
    @Output() complaintTypeOptionClicked = new EventEmitter<any>();
    @Output() statusOptionClicked = new EventEmitter<any>();
    @Output() openAssignEmployeeDialog = new EventEmitter<any>();
    @Output() openComplaint = new EventEmitter<any>();
    @Output() deleteComplaint = new EventEmitter<any>();
    @Output() startNewProgressBar = new EventEmitter<any>();


    searchString: string = "";
    showFilterOptionComplaintType: boolean = false;
    showFilterOptionStatus: boolean = false;

    htmlRenderer: ListComplaintsHtmlRenderer;


    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.htmlRenderer = new ListComplaintsHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Select All Complaint Type */
    selectAllComplaintType() {
        this.filterComplaintTypeList.forEach((complaintType) => {
            complaintType["selected"] = true;
        });
        this.startNewProgressBar.emit();
    }  // Ends: selectAllComplaintType()

    /* Unselect All Complaint Type */
    unselectAllComplaintType() {
        this.filterComplaintTypeList.forEach((complaintType) => {
            complaintType["selected"] = false;
        });
        this.startNewProgressBar.emit();
    }  // Ends: unselectAllComplaintType()

    /* Select All Status */
    selectAllStatus() {
        this.filterStatusList.forEach((status) => {
            status["selected"] = true;
        });
        this.startNewProgressBar.emit();
    }  // Ends: selectAllStatus()

    /* Unselect All Status */
    unselectAllStatus() {
        this.filterStatusList.forEach((status) => {
            status["selected"] = false;
        });
        this.startNewProgressBar.emit();
    }  // Ends: unselectAllStatus()

    triggerSearchChanged() {
        this.searchComplaints.emit(this.searchString);
    }

    /* Debouncing */
    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
        clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }  // Ends: debounce()

    searchChanged = this.debounce(() => this.triggerSearchChanged());

    triggerDoneIconClicked() {
        this.doneIconClicked.emit(this.searchString);
    }

    triggerSortNewestClicked() {
        this.sortNewestClicked.emit();
    }

    triggerSortOldestClicked() {
        this.sortOldestClicked.emit();
    }

    triggerComplaintTypeOptionClicked(complaintType) {
        this.complaintTypeOptionClicked.emit(complaintType);
    }

    triggerStatusOptionClicked(status) {
        this.statusOptionClicked.emit(status);
    }

    triggerOpenAssignEmployeeDialog(complaint, idx) {
        let response = [];
        response.push(complaint);
        response.push(idx);

        this.openAssignEmployeeDialog.emit(response);
    }

    triggerOpenComplaint(complaint, idx) {
        let response = [];
        response.push(complaint);
        response.push(idx);

        this.openComplaint.emit(response);
    }

    triggerDeleteComplaint(complaint, idx) {
        let response = [];
        response.push(complaint);
        response.push(idx);

        this.deleteComplaint.emit(response);
    }
}
