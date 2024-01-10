import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import ManageTypeServiceAdapter from "./manage_type.service.adapter";
import { LeavePlanToLeaveType, LeaveType, LeaveTypeMonth } from "@modules/leaves/classes/leaves";
@Component({
    selector: "manage-type",
    templateUrl: "./manage_type.component.html",
    styleUrls: ["./manage_type.component.css"],
    providers: [GenericService],
})
export class ManageTypeComponent implements OnInit {
    user: User;
    // service Adapter
    serviceAdapter: ManageTypeServiceAdapter = new ManageTypeServiceAdapter();
    // page variables
    leaveTypeList: Array<LeaveType> = [];
    leaveTypeMonthList: Array<LeaveTypeMonth> = [];
    leavePlanToLeaveTypeList: Array<LeavePlanToLeaveType> = [];
    isFormVisible: boolean = false;
    isLoading: boolean = false;
    invalidNameList: Array<string> = [];
    currentSchoolLeaveType: LeaveType = {
        id: -1,
        leaveTypeName: "",
        color: "",
        leaveType: "None",
        parentSchool: "",
    };
    isSaving: boolean = false;
    monthList: Array<string> = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    currentSchoolLeaveTypeMonthList: Array<LeaveTypeMonth> = [];
    async ngOnInit() : Promise<void> {
        this.currentSchoolLeaveTypeMonthList = [];
        this.monthList.map((month) => {
            this.currentSchoolLeaveTypeMonthList.push({
                id: -1,
                parentSchoolLeaveType: -1,
                month: month,
                value: 0,
                remainingLeavesAction: "",
            });
        });
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }
    constructor(public genericService: GenericService) {}
    // handle Modal
    addOrUpdateLeaveType(isNew, schoolLeaveType): void {
        this.invalidNameList = [];
        this.leaveTypeList.map((leaveType) => {
            this.invalidNameList.push(leaveType.leaveTypeName);
        });
        if (isNew) {
            this.currentSchoolLeaveType = {
                id: -1,
                leaveTypeName: "",
                color: "",
                leaveType: "None",
                parentSchool: "",
            };
            this.currentSchoolLeaveTypeMonthList = [];
            this.monthList.map((month) => {
                this.currentSchoolLeaveTypeMonthList.push({
                    id: -1,
                    parentSchoolLeaveType: -1,
                    month: month,
                    value: 0,
                    remainingLeavesAction: "CarryForward",
                });
            });
        } else {
            this.currentSchoolLeaveType = schoolLeaveType;
            this.currentSchoolLeaveTypeMonthList = [];
            this.leaveTypeMonthList.map((leaveTypeMonth) => {
                if (this.currentSchoolLeaveType.id === leaveTypeMonth.parentSchoolLeaveType) {
                    this.currentSchoolLeaveTypeMonthList.push(leaveTypeMonth);
                }
            });
        }
        this.isFormVisible = true;
    }
    closeAddNewType(event): void {
        this.isFormVisible = false;
    }
}
