import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import { LeavePlan, LeavePlanToLeaveType, LeaveType } from "@modules/leaves/classes/leaves";
import ManageTypeServiceAdapter from "../manage_type/manage_type.service.adapter";

@Component({
    selector: "manage-plan",
    templateUrl: "./manage_plan.component.html",
    styleUrls: ["./manage_plan.component.css"],
    providers: [GenericService],
})
export class ManagePlanComponent implements OnInit {
    user: User;
    serviceAdapterGeneric: ManageTypeServiceAdapter = new ManageTypeServiceAdapter();
    constructor(public genericService: GenericService) {}
    async ngOnInit(): Promise<void> {
        this.serviceAdapterGeneric.initializeAdapter(this);
        await this.serviceAdapterGeneric.initializeData({ leaves_app: "SchoolLeavePlan" }, "leavePlanList", {
            filter: { parentSchool: this.user.activeSchool.dbId },
        }, true);
        await this.serviceAdapterGeneric.initializeData({ leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, "leavePlanToLeaveTypeList", {
            filter: { parentSchoolLeavePlan__parentSchool__id: this.user.activeSchool.dbId },
        }, true);
        await this.serviceAdapterGeneric.initializeData({ leaves_app: "SchoolLeaveType" }, "leaveTypeList", {
            filter: { parentSchool: this.user.activeSchool.dbId },
        });
    }
    // page manage variables
    isSelectLeavePlanToLeaveTypeVisible: boolean = false;
    isLoading: boolean = true;
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
    resetComponent(): void {
        this.currentLeavePlan = {};
        this.isLeavePlanOpen = this.isSelectLeavePlanToLeaveTypeVisible = this.isAddNewOpen = false;
        this.leavePlanName = "";
        this.leaveTypeChoiceList = this.currentLeaveTypeChoiceList = this.appliedLeaveTypeChoiceList = [];
    }
    async savePlan(data): Promise<any> {
        this.isLoading = true;
        if (!data.leavePlanName.match(/[A-Za-z][A-Za-z0-9- ]*/g) || data.leavePlanName.match(/[A-Za-z][A-Za-z0-9- ]*/g).length !== 1) {
            this.isLoading = false;
            return alert("Please Enter a valid Leave Plan Name. (start with lowercase / uppercase english alphabets and contains only alphabets, numbers, spaces and hyphens.)");
        }
        let removeLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        let addLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        let oldLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id ? oldLeaveTypeChoiceList.push(leavePlanToLeaveTypeItem) : null;
        });
        oldLeaveTypeChoiceList.map((oldLeaveTypeChoice) => {
            let similarLeaveType = this.appliedLeaveTypeChoiceList.find((leaveType) => {
                return leaveType.id === oldLeaveTypeChoice.parentSchoolLeaveType;
            });
            !similarLeaveType ? removeLeaveTypeChoiceList.push(oldLeaveTypeChoice) : null;
        });
        this.appliedLeaveTypeChoiceList.map((leaveType) => {
            let similarLeaveType = oldLeaveTypeChoiceList.find((oldLeaveTypeChoice) => leaveType.id === oldLeaveTypeChoice.parentSchoolLeaveType);
            !similarLeaveType ? addLeaveTypeChoiceList.push({ id: -1,
                parentSchoolLeavePlan: this.currentLeavePlan.id, parentSchoolLeaveType: leaveType.id, }) : null;
        });
        await this.serviceAdapterGeneric.handleDataChange({
                check: (data1, data2) => {
                    return (data2.id != data1.id && data1.leavePlanName.toString().toLowerCase() === data2.leavePlanName.toString().toLowerCase()) ? ["Leave Plan Name"] : [];
                },
                data: [data], database: { leaves_app: "SchoolLeavePlan" }, operation: data.id ? "update" : "insert",
            }, "leavePlanList");
        removeLeaveTypeChoiceList.length ? await this.serviceAdapterGeneric.handleDataChange({
                check: null,
                data: removeLeaveTypeChoiceList, database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, operation: "deleteBatch",
            }, "leavePlanToLeaveTypeList") : null;
        addLeaveTypeChoiceList.length ? await this.serviceAdapterGeneric.handleDataChange({
            check: null,
            data: addLeaveTypeChoiceList, database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, operation: "insertBatch",
        }, "leavePlanToLeaveTypeList") : null;
        this.resetComponent();
    }
    async handleDelete(): Promise<any> {
        let oldLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id ? oldLeaveTypeChoiceList.push(leavePlanToLeaveTypeItem) : null;
        });
        if (oldLeaveTypeChoiceList.length) {
            await this.serviceAdapterGeneric.handleDataChange({
                    check: null, data: oldLeaveTypeChoiceList, database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, operation: "deleteBatch",
                }, "leavePlanToLeaveTypeList");
        }
        await this.serviceAdapterGeneric.handleDataChange({
                check: null, data: [this.currentLeavePlan], database: { leaves_app: "SchoolLeavePlan" }, operation: "delete",
            }, "leavePlanList");
        this.resetComponent();
    }
    setPlan(leavePlan): void {
        this.isLeavePlanOpen = true;
        this.currentLeavePlan = JSON.parse(JSON.stringify(leavePlan));
        this.appliedLeaveTypeChoiceList = [];
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id ? this.appliedLeaveTypeChoiceList.push(
                this.leaveTypeList.find((leaveType) => leaveType.id === leavePlanToLeaveTypeItem.parentSchoolLeaveType),
            ) : null;
        });
    }
    enableAddPlanToLeaveType(): void {
        this.isSelectLeavePlanToLeaveTypeVisible = true;
        this.updateChoiceList();
    }
    updateChoiceList(): void {
        this.leaveTypeChoiceList = [];
        this.leaveTypeList.map((leaveType) => {
            const similarChoices = this.appliedLeaveTypeChoiceList.filter((appliedLeaveType) => leaveType.id === appliedLeaveType.id);
            !similarChoices.length ? this.leaveTypeChoiceList.push(leaveType) : null;
        });
    }
    savePlanToLeaveType(LeavePlanToLeaveType): void {
        if (LeavePlanToLeaveType.length) {
            this.appliedLeaveTypeChoiceList.push(...LeavePlanToLeaveType);
        } else {
            this.currentLeaveTypeChoiceList = this.appliedLeaveTypeChoiceList;
        }
        this.isSelectLeavePlanToLeaveTypeVisible = false;
        this.currentLeaveTypeChoiceList = [];
    }
    removeLeaveTypeChoice(LeaveTypeChoice): void {
        let temporaryLeaveTypeChoiceList: Array<LeaveType> = [];
        this.appliedLeaveTypeChoiceList.map((leaveTypeChoiceItem) => {
            leaveTypeChoiceItem !== LeaveTypeChoice ? temporaryLeaveTypeChoiceList.push(leaveTypeChoiceItem) : null;
        });
        this.currentLeaveTypeChoiceList = temporaryLeaveTypeChoiceList;
        this.appliedLeaveTypeChoiceList = temporaryLeaveTypeChoiceList;
        this.updateChoiceList();
    }
}
