import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import ManageLeavePlanServiceAdapter from "./manage_leave_plan.service.adapter";
import { EmployeeLeaveType, LeavePlan, LeavePlanToEmployee, LeavePlanToLeaveType, LeaveType } from "@modules/leaves/classes/leaves";

@Component({
    selector: "manage-leave-plan",
    templateUrl: "./manage_leave_plan.component.html",
    styleUrls: ["./manage_leave_plan.component.css"],
    providers: [GenericService],
})
export class ManageLeavePlanComponent implements OnInit {
    user: User;
    isLoading: boolean = false;
    serviceAdapter: ManageLeavePlanServiceAdapter = new ManageLeavePlanServiceAdapter();
    constructor(public genericService: GenericService) {}
    ngOnInit() {
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }
    // LeavePlans
    leavePlanList: Array<LeavePlan> = [];
    // LeaveTypes
    leaveTypeList: Array<LeaveType> = [];
    currentLeaveTypeList: Array<LeaveType> = [];
    // employee Data
    employeeChoiceList: Array<any> = [];
    filteredEmployeeChoiceList: Array<any> = [];
    currentEmployee: any = null;
    filter: string = "";
    // Active Leave Plans for an employee
    leavePlanToEmployeeList: Array<LeavePlanToEmployee> = [];
    // leaveTypes available for a specific employee
    employeeLeaveTypeList: Array<EmployeeLeaveType> = [];
    selectedEmployeeLeaveTypeList: Array<EmployeeLeaveType> = [];
    temporaryEmployeeLeaveTypeList: Array<EmployeeLeaveType> = [];
    // leavePlan to leaveType
    leavePlanToLeaveTypeList: Array<LeavePlanToLeaveType> = [];
    // active Leave Plan
    activeLeavePlan: LeavePlan = null;
    currentLeavePlan: LeavePlan = null;
    isCustomized: boolean = false;
    // starts :- function to update list of employees
    updateEmployeeChoiceList(): void {
        this.filteredEmployeeChoiceList = [];
        this.employeeChoiceList.forEach((employee) => {
            employee.name.toLowerCase().startsWith(this.filter.toLowerCase()) ? this.filteredEmployeeChoiceList.push(employee) : null;
        });
    }
    // ends :- function to update list of employees

    // starts :- function to update leavePlanList for an employee
    updateLeavePlanList(): void {
        if (!this.currentEmployee) {
            return;
        }
        this.activeLeavePlan = null;
        this.filter = "";
        this.filteredEmployeeChoiceList = this.employeeChoiceList;
        const employeeLeavePlan = this.leavePlanToEmployeeList.find((leavePlanToEmployee) => leavePlanToEmployee.parentEmployee === this.currentEmployee.id);
        this.isCustomized = employeeLeavePlan ? employeeLeavePlan.isCustomized : false;
        this.activeLeavePlan = employeeLeavePlan ? this.leavePlanList.find((leavePlan) => leavePlan.id === employeeLeavePlan.parentSchoolLeavePlan) : null;
        this.currentLeavePlan = this.activeLeavePlan;
        this.selectedEmployeeLeaveTypeList = this.employeeLeaveTypeList.filter(
            (employeeLeaveType) => employeeLeaveType.parentEmployee == this.currentEmployee.id
        );
        this.currentLeaveTypeList = this.getCurrentLeaveTypeList();
        this.prepareTemporaryLeavePlan();
    }
    // ends :- function to update leavePlanList for an employee

    // starts :- function to get current leave type list
    getCurrentLeaveTypeList(): Array<LeaveType> {
        return this.leaveTypeList.filter((leaveType) =>
            this.selectedEmployeeLeaveTypeList.find((employeeLeaveType) => employeeLeaveType.parentLeaveType == leaveType.id)
        );
    }
    // ends :- function to get current leave type list

    // starts :- function to refresh data.
    async refreshEmployeeData(): Promise<void> {
        this.isLoading = true;
        await this.serviceAdapter.initializeData();
        this.updateLeavePlanList();
    }
    // ends :- function to refresh data.

    // starts :- function to prepare a temporary leave types list
    prepareTemporaryLeavePlan() {
        this.temporaryEmployeeLeaveTypeList = this.leavePlanToLeaveTypeList
        .filter(leavePlanToLeaveType => leavePlanToLeaveType.parentSchoolLeavePlan == this.currentLeavePlan.id)
        .map(leavePlanToLeaveType => {
            const similarLeaveType = this.leaveTypeList.find(leaveType => leaveType.id == leavePlanToLeaveType.parentSchoolLeaveType);
            return {
                id: -1,
                color: similarLeaveType.color,
                leaveType: similarLeaveType.leaveType,
                parentEmployee: this.currentEmployee.id,
                parentLeaveType: similarLeaveType.id,
                leaveTypeName: similarLeaveType.leaveTypeName
            };
        });
    }
    // ends :- function to prepare a temporary leave types list
}
