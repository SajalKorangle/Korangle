import { Component, Input, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import ManageTypeServiceAdapter from "./manage_type.service.adapter";

@Component({
    selector: "manage-type",
    templateUrl: "./manage_type.component.html",
    styleUrls: ["./manage_type.component.css"],
    providers: [GenericService],
})
export class ManageTypeComponent implements OnInit {
    @Input() user: User;
    // service Adapter
    serviceAdapter: ManageTypeServiceAdapter = new ManageTypeServiceAdapter();
    // page variables
    leaveTypeList: any = [];
    isFormVisible: boolean = false;
    isLoading: boolean = false;

    ngOnInit() {
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    constructor(public genericService: GenericService) {}
    // handle Modal
    addNewType(): void {
        this.isFormVisible = true;
    }
    closeAddNewType(): void {
        this.isFormVisible = false;
    }
    saveLeaveType(): void {
        alert("Under Construction!");
    }
}
