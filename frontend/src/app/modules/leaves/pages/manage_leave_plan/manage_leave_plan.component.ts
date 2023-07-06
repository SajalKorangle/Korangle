import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import ManageLeavePlanServiceAdapter from "./manage_leave_plan.service.adapter";
import { LeavePlan, LeavePlanToEmployee } from "@modules/leaves/classes/leaves";

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
    async ngOnInit(): Promise<void> {
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }
    // LeavePlans
    leavePlanList: Array<LeavePlan> = [];
    // LeaveTypes
    leaveTypeList: Array<LeaveType> = [];
    // employee Data
    employeeChoiceList: Array<any> = [];
    filteredEmployeeChoiceList: Array<any> = [];
    currentEmployee: any = null;
    filter: string = "";
    // Active Leave Plans for an employee
    leavePlanToEmployeeList: Array<LeavePlanToEmployee> = [];
    // leaveTypes available for a specific employee
    employeeLeaveTypeList: Array<EmployeeLeaveType> = [];
    selectedEmployeeLeaveTypeList: Array<LeaveType> = [];
    employeeLeaveTypeChoiceList: Array<LeaveType> = [];
    currentEmployeeLeaveTypeList: Array<LeaveType> = [];
    // leavePlan to leaveType
    leavePlanToLeaveTypeList: Array<LeavePlanToLeaveType> = [];
    // active Leave Plan
    activeLeavePlan: LeavePlan = null;
    currentLeavePlan: LeavePlan = null;

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
        this.activeLeavePlan = employeeLeavePlan ? this.leavePlanList.find((leavePlan) => leavePlan.id === employeeLeavePlan.parentSchoolLeavePlan) : null;
        this.currentLeavePlan = this.activeLeavePlan;
        // set employee leave type
        this.employeeLeaveTypeChoiceList = [];
        this.selectedEmployeeLeaveTypeList = [];
        this.isLeaveTypeChoiceVisible = false;
        this.leavePlanToEmployeeList.forEach((leavePlanToEmployee) => {
            this.currentEmployee.id === leavePlanToEmployee.parentEmployee
                ? this.currentLeavePlanList.push(this.leavePlanList.find((leavePlan) => leavePlan.id === leavePlanToEmployee.parentSchoolLeavePlan))
                : null;
        });
        this.employeeLeavePlanList.forEach((employeeLeavePlan) => {
            this.activeLeavePlan =
                this.currentEmployee.id === employeeLeavePlan.parentEmployee
                    ? this.currentLeavePlanList.find((leavePlan) => {
                          return leavePlan.id === employeeLeavePlan.activeLeavePlan;
                      })
                    : this.activeLeavePlan;
        });
        this.currentLeavePlan = this.currentLeavePlan === null ? this.activeLeavePlan : this.currentLeavePlan;
        // update list of leave type under this leave plan
        if (this.currentLeavePlan !== null) {
            this.leavePlanToLeaveTypeList.forEach((leavePlanToLeaveType) => {
                leavePlanToLeaveType.parentSchoolLeavePlan === this.currentLeavePlan.id
                    ? this.employeeLeaveTypeChoiceList.push(this.leaveTypeList.find((leaveType) => leaveType.id === leavePlanToLeaveType.parentSchoolLeaveType))
                    : null;
            });
            this.employeeLeaveTypeList.forEach((employeeLeaveType) => {
                employeeLeaveType.parentEmployee === this.currentEmployee.id && employeeLeaveType.parentLeavePlan === this.currentLeavePlan.id
                    ? this.selectedEmployeeLeaveTypeList.push(this.leaveTypeList.find((leaveType) => leaveType.id === employeeLeaveType.parentLeaveType))
                    : null;
            });
            this.currentEmployeeLeaveTypeList = this.selectedEmployeeLeaveTypeList;
        }
    }
    // ends :- function to update leavePlanList for an employee

    // starts :- function to refresh data.
    async refreshEmployeeData(): Promise<void> {
        this.isLoading = true;
        await this.serviceAdapter.initializeData();
        this.updateLeavePlanList();
    }
    // ends :- function to refresh data.
}
