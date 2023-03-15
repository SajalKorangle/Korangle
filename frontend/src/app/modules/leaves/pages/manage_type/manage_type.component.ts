import { Component, Input, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";

@Component({
    selector: "manage-type",
    templateUrl: "./manage_type.component.html",
    styleUrls: ["./manage_type.component.css"],
    providers: [GenericService],
})
export class ManageTypeComponent implements OnInit {
    @Input() user: User;
    // page variables
    leaveTypeList: any = [];
    isFormVisible: boolean = false;
    isLoading: boolean = false;

    ngOnInit() {
        this.leaveTypeList = [];
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
