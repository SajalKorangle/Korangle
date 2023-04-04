import { Component, Input, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import ManageTypeServiceAdapter from "./manage_type.service.adapter";
import { LeaveType, LeaveTypeMonth } from "@modules/leaves/classes/leaves";
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
    isFormVisible: boolean = false;
    isLoading: boolean = true;
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
    ngOnInit() {
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
        this.serviceAdapter.initializeData({ leaves_app: "SchoolLeaveType" }, "leaveTypeList");
        this.serviceAdapter.initializeData({ leaves_app: "SchoolLeaveTypeMonth" }, "leaveTypeMonthList");
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
    async saveLeaveType(data): Promise<any> {
        this.isSaving = true;
        let response = await this.serviceAdapter.handleDataChange(data, data.setVariable);
        if (response !== null && response !== undefined && JSON.stringify(response) !== "{}") {
            if (data.setVariableNameMap) {
                Object.keys(data.setVariableNameMap).map((variableName) => {
                    this[variableName] = data.setVariableNameMap[variableName] === "response" ? response : data.setVariableNameMap[variableName];
                });
            }
            if (data.close) {
                if (data.operation.startsWith("update")) {
                    alert("Leave Type updated successfully.");
                }
                this.isSaving = false;
                this.closeAddNewType(data);
            }
        } else {
            this.isSaving = false;
        }
    }
    async deleteType(event, schoolLeaveType): Promise<any> {
        this.currentSchoolLeaveType = schoolLeaveType;
        this.currentSchoolLeaveTypeMonthList = [];
        this.leaveTypeMonthList.map((leaveTypeMonth) => {
            if (this.currentSchoolLeaveType.id === leaveTypeMonth.parentSchoolLeaveType) {
                this.currentSchoolLeaveTypeMonthList.push(leaveTypeMonth);
            }
        });
        let response = await this.serviceAdapter.handleDataChange({
            database: { leaves_app: "SchoolLeaveTypeMonth" },
            operation: "deleteBatch",
            check: (data1, data2) => {
                return [];
            },
            data: this.currentSchoolLeaveTypeMonthList,
        }, "leaveTypeMonthList");
        if (response !== null && response !== undefined && JSON.stringify(response) !== "{}") {
            response = await this.serviceAdapter.handleDataChange({
                database: { leaves_app: "SchoolLeaveType" },
                operation: "delete",
                check: (data1, data2) => {
                    return [];
                },
                data: [this.currentSchoolLeaveType],
            }, "leaveTypeList");
            if (response && JSON.stringify(response) !== '{}') {
                alert("Leave Type deleted successfully");
            }
        }
    }
}
