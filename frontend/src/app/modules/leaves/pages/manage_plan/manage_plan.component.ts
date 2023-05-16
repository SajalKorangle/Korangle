import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import { LeavePlan, LeavePlanToLeaveType, LeaveType } from "@modules/leaves/classes/leaves";
import ManagePlanServiceAdapter from "./manage_plan.service.adapter";

@Component({
    selector: "manage-plan",
    templateUrl: "./manage_plan.component.html",
    styleUrls: ["./manage_plan.component.css"],
    providers: [GenericService],
})
export class ManagePlanComponent implements OnInit {
    user: User;
    serviceAdapter: ManagePlanServiceAdapter = new ManagePlanServiceAdapter();
    // page manage variables
    isSelectLeavePlanToLeaveTypeVisible: boolean = false;
    isLoading: boolean = false;
    isLeavePlanOpen: boolean = false;
    leavePlanName: string = "";
    isAddNewOpen: boolean = false;
    currentLeavePlan: any = {};
    // choices
    leaveTypeChoiceList: Array<LeaveType> = [];
    currentLeaveTypeChoiceList: Array<LeaveType> = [];
    appliedLeaveTypeChoiceList: Array<LeaveType> = [];
    // data variables
    leavePlanList: Array<LeavePlan> = [];
    leavePlanToLeaveTypeList: Array<LeavePlanToLeaveType> = [];
    leaveTypeList: Array<LeaveType> = [];

    constructor(public genericService: GenericService) {}
    async ngOnInit(): Promise<void> {
        this.isLoading = true;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }
    resetComponent(): void {
        this.currentLeavePlan = {};
        this.leavePlanName = "";
        this.isLeavePlanOpen = this.isSelectLeavePlanToLeaveTypeVisible = this.isAddNewOpen = false;
        this.leaveTypeChoiceList = this.currentLeaveTypeChoiceList = this.appliedLeaveTypeChoiceList = [];
    }
    setPlan(leavePlan): void {
        this.isLeavePlanOpen = true;
        this.currentLeavePlan = JSON.parse(JSON.stringify(leavePlan));
        this.appliedLeaveTypeChoiceList = [];
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id
        ? this.appliedLeaveTypeChoiceList.push(this.leaveTypeList.find((leaveType) => leaveType.id === leavePlanToLeaveTypeItem.parentSchoolLeaveType))
        : null);
    }
    enableAddPlanToLeaveType(): void {
        this.isSelectLeavePlanToLeaveTypeVisible = true;
        this.updateChoiceList();
    }
    updateChoiceList(): void {
        this.leaveTypeChoiceList = [];
        this.leaveTypeList.map((leaveType) => {
            !this.appliedLeaveTypeChoiceList.filter((appliedLeaveType) => leaveType.id === appliedLeaveType.id).length ?
            this.leaveTypeChoiceList.push(leaveType) : null;
        });
    }
    savePlanToLeaveType(LeavePlanToLeaveType): void {
        LeavePlanToLeaveType.length ? this.appliedLeaveTypeChoiceList.push(...LeavePlanToLeaveType) : null;
        this.currentLeaveTypeChoiceList = !LeavePlanToLeaveType.length ? this.appliedLeaveTypeChoiceList : this.currentLeaveTypeChoiceList;
        this.isSelectLeavePlanToLeaveTypeVisible = false;
        this.currentLeaveTypeChoiceList = [];
    }
    removeLeaveTypeChoice(LeaveTypeChoice): void {
        let temporaryLeaveTypeChoiceList: Array<LeaveType> = [];
        this.appliedLeaveTypeChoiceList.map((leaveTypeChoiceItem) => {
            leaveTypeChoiceItem !== LeaveTypeChoice ? temporaryLeaveTypeChoiceList.push(leaveTypeChoiceItem) : null;
        });
        this.currentLeaveTypeChoiceList = [];
        this.appliedLeaveTypeChoiceList = temporaryLeaveTypeChoiceList;
        this.updateChoiceList();
    }
}
