import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import ManagePlanServiceAdapter from "./manage_plan.service.adapter";
import { LeavePlan, LeavePlanToLeaveType, LeaveType } from "@modules/leaves/classes/leaves";

@Component({
    selector: "manage-plan",
    templateUrl: "./manage_plan.component.html",
    styleUrls: ["./manage_plan.component.css"],
    providers: [GenericService],
})
export class ManagePlanComponent implements OnInit {
    user: User;
    serviceAdapter: ManagePlanServiceAdapter = new ManagePlanServiceAdapter();
    constructor(public genericService: GenericService) {}
    ngOnInit(): void {
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }
    // page manage variables
    isLoading: boolean = false;
    isLeavePlanOpen: boolean = false;
    leavePlanName: string = "";
    isAddNewOpen: boolean = false;
    currentLeavePlan: any = {};
    // data variables
    leavePlanList: Array<LeavePlan> = [];
    leavePlanToLeaveTypeList: Array<LeavePlanToLeaveType> = [];
    leaveTypeList: Array<LeaveType> = [];
    resetComponent(): void {
        this.currentLeavePlan = {};
        this.isLeavePlanOpen = false;
        this.isAddNewOpen = false;
        this.leavePlanName = "";
    }
    savePlan(): void {
        this.serviceAdapter.handleDataChange({ leavePlanName: this.leavePlanName }, "insert");
        this.resetComponent();
    }
    handleDelete(): void {
        this.serviceAdapter.handleDataChange(this.currentLeavePlan, "delete");
        this.resetComponent();
    }
    setPlan(leavePlan): void {
        this.isLeavePlanOpen = true;
        this.currentLeavePlan = leavePlan;
    }
}
