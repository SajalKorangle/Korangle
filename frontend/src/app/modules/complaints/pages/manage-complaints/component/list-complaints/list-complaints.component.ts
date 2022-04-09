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
    @Input() userPermission;
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
    @Output() loadMoreClick = new EventEmitter<any>();


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

    /* Search Complaints */
    triggerSearchChanged() {
        this.searchComplaints.emit(this.searchString);
    }  // Ends: triggerSearchChanged()

    /* Debouncing */
    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
        clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }  // Ends: debounce()

    searchChanged = this.debounce(() => this.triggerSearchChanged());

    /* Done Icon Clicked */
    triggerDoneIconClicked() {
        this.doneIconClicked.emit(this.searchString);
    }  // Ends: triggerDoneIconClicked()

    /* Sort Newest */
    triggerSortNewestClicked() {
        this.sortNewestClicked.emit();
    }  // Ends: triggerSortNewestClicked()

    /* Sort Oldest */
    triggerSortOldestClicked() {
        this.sortOldestClicked.emit();
    }  // Ends: triggerSortOldestClicked()

    /* Complaint Type Option Clicked */
    triggerComplaintTypeOptionClicked(complaintType) {
        this.complaintTypeOptionClicked.emit(complaintType);
    }  // Ends: triggerComplaintTypeOptionClicked()

    /* Status Option Clicked */
    triggerStatusOptionClicked(status) {
        this.statusOptionClicked.emit(status);
    }  // Ends: triggerStatusOptionClicked()

    /* Open Assign Employee Modal */
    triggerOpenAssignEmployeeDialog(complaint, idx) {
        let response = [];
        response.push(complaint);
        response.push(idx);

        this.openAssignEmployeeDialog.emit(response);
    }  // Ends: triggerOpenAssignEmployeeDialog()

    /* Open Complaint */
    triggerOpenComplaint(complaint, idx) {
        let response = [];
        response.push(complaint);
        response.push(idx);

        this.openComplaint.emit(response);
    }  // Ends: triggerOpenComplaint()

    /* Delete Complaint */
    triggerDeleteComplaint(complaint, idx) {
        let response = [];
        response.push(complaint);
        response.push(idx);

        this.deleteComplaint.emit(response);
    }  // Ends: triggerDeleteComplaint()

    /* Load More Clicked */
    triggerLoadMoreClicked() {
        this.loadMoreClick.emit();
    }  // Ends: triggerLoadMoreClicked()
}
