import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';


@Component({
    selector: 'app-show-table',
    templateUrl: './show-table.component.html',
    styleUrls: ['./show-table.component.css']
})
export class ShowTableComponent implements OnInit {
    @Input() user;
    @Input() complaintTypeList;
    @Input() statusList;
    @Output() editComplaintType = new EventEmitter<any>();
    @Output() deleteComplaintType = new EventEmitter<any>();
    @Output() changePageName = new EventEmitter<string>();
    @Output() openChangeStatusDialog = new EventEmitter<any>();
    @Output() deleteStatus = new EventEmitter<any>();
    @Output() openAddStatusDialog = new EventEmitter<any>();
    @Output() initializeComplaintTypeDetails = new EventEmitter<any>();

    constructor() { }

    ngOnInit() { }

    /* Edit Complaint Type */
    triggerEditComplaintType(idx) {
        console.log("Trigger edit complaint type called.");
        console.log("Idx: ", idx);

        console.log("Complaint Type List: ", this.complaintTypeList);

        let response = [];
        response.push(this.complaintTypeList[idx]);
        response.push(idx);

        this.editComplaintType.emit(response);
    }   // Ends: triggerEditComplaintType()

    /* Delete Complaint Type */
    triggerDeleteComplaintType(idx) {
        console.log("Trigger delete complaint type called.");
        console.log("Idx: ", idx);

        console.log("Complaint Type List: ", this.complaintTypeList);

        let response = [];
        response.push(this.complaintTypeList[idx]);
        response.push(idx);

        this.deleteComplaintType.emit(response);
    }   // Ends: triggerDeleteComplaintType()

    /* Change Page */
    changePage() {
        this.initializeComplaintTypeDetails.emit();
        this.changePageName.emit("addCompalintType");
    }   // Ends: changePage()

    /* Open Change-Status Modal */
    triggerOpenChangeStatusDialog(status, idx) {
        let response = [];
        response.push(status);
        response.push(idx);

        this.openChangeStatusDialog.emit(response);
    }   // Ends: triggerOpenChangeStatusDialog()

    /* Delete Status */
    triggerDeleteStatus(status, idx) {
        let response = [];
        response.push(status);
        response.push(idx);

        this.deleteStatus.emit(response);
    }   // Ends: triggerDeleteStatus()

    /* Open Add-Status Modal */
    triggerOpenAddStatusDialog() {
        this.openAddStatusDialog.emit();
    }   // Ends: triggerOpenAddStatusDialog()
}
