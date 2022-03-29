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

    constructor() { }

    ngOnInit() { }

    triggerEditComplaintType(complaintType, idx) {
        let response = [];
        response.push(complaintType);
        response.push(idx);

        this.editComplaintType.emit(response);
    }

    triggerDeleteComplaintType(complaintType, idx) {
        let response = [];
        response.push(complaintType);
        response.push(idx);

        this.deleteComplaintType.emit(response);
    }

    changePage() {
        this.changePageName.emit("addCompalintType");
    }

    triggerOpenChangeStatusDialog(status, idx) {
        let response = [];
        response.push(status);
        response.push(idx);

        this.openChangeStatusDialog.emit(response);
    }

    triggerDeleteStatus(status, idx) {
        let response = [];
        response.push(status);
        response.push(idx);

        this.deleteStatus.emit(response);
    }

    triggerOpenAddStatusDialog() {
        this.openAddStatusDialog.emit();
    }
}
