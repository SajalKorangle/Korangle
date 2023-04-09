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
    ngOnInit(): void {
        this.serviceAdapterGeneric.initializeAdapter(this);
        this.serviceAdapterGeneric.initializeData({ leaves_app: "SchoolLeavePlan" }, "leavePlanList", {
            filter: { parentSchool: this.user.activeSchool.dbId },
        });
        this.serviceAdapterGeneric.initializeData({ leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, "leavePlanToLeaveTypeList", {
            filter: { parentSchoolLeavePlan__parentSchool__id: this.user.activeSchool.dbId },
        });
        this.serviceAdapterGeneric.initializeData({ leaves_app: "SchoolLeaveType" }, "leaveTypeList", {
            filter: { parentSchool: this.user.activeSchool.dbId },
        });
    }
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
    resetComponent(): void {
        this.currentLeavePlan = {};
        this.isLeavePlanOpen = false;
        this.isAddNewOpen = false;
        this.leavePlanName = "";
        this.leaveTypeChoiceList = [];
        this.currentLeaveTypeChoiceList = [];
        this.appliedLeaveTypeChoiceList = [];
        this.isSelectLeavePlanToLeaveTypeVisible = false;
    }
    async savePlan(data): Promise<any> {
        this.isLoading = true;
        let removeLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        let addLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        let oldLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            if (leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id) {
                oldLeaveTypeChoiceList.push(leavePlanToLeaveTypeItem);
            }
        });
        oldLeaveTypeChoiceList.map((oldLeaveTypeChoice) => {
            let similarLeaveType = this.appliedLeaveTypeChoiceList.find((leaveType) => {
                return leaveType.id === oldLeaveTypeChoice.parentSchoolLeaveType;
            });
            if (!similarLeaveType) {
                removeLeaveTypeChoiceList.push(oldLeaveTypeChoice);
            }
        });
        this.appliedLeaveTypeChoiceList.map((leaveType) => {
            let similarLeaveType = oldLeaveTypeChoiceList.find((oldLeaveTypeChoice) => {
                return leaveType.id === oldLeaveTypeChoice.parentSchoolLeaveType;
            });
            if (!similarLeaveType) {
                addLeaveTypeChoiceList.push({id: -1, parentSchoolLeavePlan: this.currentLeavePlan.id, parentSchoolLeaveType: leaveType.id, });
            }
        });
        await this.serviceAdapterGeneric.handleDataChange(
            {
                check: (data1, data2) => {
                    if (data2.id != data1.id && data1.leavePlanName.toString().toLowerCase() === data2.leavePlanName.toString().toLowerCase()) {
                        return ["Leave Plan Name"];
                    }
                    return [];
                },
                data: [data], database: { leaves_app: "SchoolLeavePlan" }, operation: data.id ? "update" : "insert",
            },
            "leavePlanList",
        );
        if (removeLeaveTypeChoiceList.length) {
            await this.serviceAdapterGeneric.handleDataChange(
                {
                    check: (data1, data2) => {
                        return [];
                    },
                    data: removeLeaveTypeChoiceList, database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, operation: "deleteBatch",
                },
                "leavePlanToLeaveTypeList",
            );
        }
        if (addLeaveTypeChoiceList.length) {
            await this.serviceAdapterGeneric.handleDataChange(
                {
                    check: (data1, data2) => {
                        return [];
                    },
                    data: addLeaveTypeChoiceList, database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, operation: "insertBatch",
                },
                "leavePlanToLeaveTypeList",
            );
        }
        this.resetComponent();
    }
    async handleDelete(): Promise<any> {
        let oldLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            if (leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id) {
                oldLeaveTypeChoiceList.push(leavePlanToLeaveTypeItem);
            }
        });
        if (oldLeaveTypeChoiceList.length) {
            await this.serviceAdapterGeneric.handleDataChange(
                {
                    check: (data1, data2) => {
                        return [];
                    },
                    data: oldLeaveTypeChoiceList, database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, operation: "deleteBatch",
                },
                "leavePlanToLeaveTypeList",
            );
        }
        await this.serviceAdapterGeneric.handleDataChange(
            {
                check: (data1, data2) => {
                    return [];
                },
                data: [this.currentLeavePlan], database: { leaves_app: "SchoolLeavePlan" }, operation: "delete",
            },
            "leavePlanList",
        );
        this.resetComponent();
    }
    setPlan(leavePlan): void {
        this.isLeavePlanOpen = true;
        this.currentLeavePlan = leavePlan;
        this.appliedLeaveTypeChoiceList = [];
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            if (leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id) {
                this.appliedLeaveTypeChoiceList.push(
                    this.leaveTypeList.find((leaveType) => {
                        return leaveType.id === leavePlanToLeaveTypeItem.parentSchoolLeaveType;
                    }),
                );
            }
        });
    }
    enableAddPlanToLeaveType(): void {
        this.isSelectLeavePlanToLeaveTypeVisible = true;
        this.updateChoiceList();
    }
    updateChoiceList(): void {
        this.leaveTypeChoiceList = [];
        this.leaveTypeList.map((leaveType) => {
            const similarChoices = this.appliedLeaveTypeChoiceList.filter((appliedLeaveType) => {
                return leaveType.id === appliedLeaveType.id;
            });
            if (!similarChoices.length) {
                this.leaveTypeChoiceList.push(leaveType);
            }
        });
    }
    savePlanToLeaveType(LeavePlanToLeaveType): void {
        if (LeavePlanToLeaveType.length) {
            this.appliedLeaveTypeChoiceList.push(...LeavePlanToLeaveType);
        } else {
            this.currentLeaveTypeChoiceList = this.appliedLeaveTypeChoiceList;
        }
        this.isSelectLeavePlanToLeaveTypeVisible = false;
    }
    removeLeaveTypeChoice(LeaveTypeChoice): void {
        let temporaryLeaveTypeChoiceList: Array<LeaveType> = [];
        this.appliedLeaveTypeChoiceList.map((leaveTypeChoiceItem) => {
            if (leaveTypeChoiceItem !== LeaveTypeChoice) {
                temporaryLeaveTypeChoiceList.push(leaveTypeChoiceItem);
            }
        });
        this.currentLeaveTypeChoiceList = temporaryLeaveTypeChoiceList;
        this.appliedLeaveTypeChoiceList = temporaryLeaveTypeChoiceList;
        this.updateChoiceList();
    }
}
