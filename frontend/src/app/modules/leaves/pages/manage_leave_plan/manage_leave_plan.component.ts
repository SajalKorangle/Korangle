import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import ManageLeavePlanServiceAdapter from "./manage_leave_plan.service.adapter";
import { EmployeeLeavePlan, EmployeeLeaveType, LeavePlan, LeavePlanToEmployee, LeavePlanToLeaveType, LeaveType } from "@modules/leaves/classes/leaves";

@Component({
    selector: "manage-leave-plan",
    templateUrl: "./manage_leave_plan.component.html",
    styleUrls: ["./manage_leave_plan.component.css"],
    providers: [GenericService],
})
export class ManageLeavePlanComponent implements OnInit {
    user: User;
    isLoading: boolean = true;
    // LeavePlans
    leavePlanList: Array<LeavePlan> = [];
    // LeaveTypes
    leaveTypeList: Array<LeaveType> = [];
    // employee Data
    employeeChoiceList: Array<any> = [];
    filteredEmployeeChoiceList: Array<any> = [];
    currentEmployee: any = null;
    filter: string = "";
    isLeaveTypeChoiceVisible: boolean = false;
    // leavePlans available for a specific employee
    leavePlanToEmployeeList: Array<LeavePlanToEmployee> = [];
    currentLeavePlanList: Array<LeavePlan> = [];
    // leaveTypes available for a specific employee
    employeeLeaveTypeList: Array<EmployeeLeaveType> = [];
    selectedEmployeeLeaveTypeList: Array<LeaveType> = [];
    employeeLeaveTypeChoiceList: Array<LeaveType> = [];
    currentEmployeeLeaveTypeList: Array<LeaveType> = [];
    // leavePlan to leaveType
    leavePlanToLeaveTypeList: Array<LeavePlanToLeaveType> = [];
    // active Leave Plan
    activeLeavePlan: LeavePlan = null;
    employeeLeavePlanList: Array<EmployeeLeavePlan> = [];
    currentLeavePlan: LeavePlan = null;
    // service adapter and data initialization
    serviceAdapter: ManageLeavePlanServiceAdapter = new ManageLeavePlanServiceAdapter();
    constructor(public genericService: GenericService) {}
    async ngOnInit(): Promise<void> {
        this.serviceAdapter.initializeAdapter(this);
        await this.serviceAdapter.initializeData();
        this.filteredEmployeeChoiceList = this.employeeChoiceList;
    }
    // update list of employees
    updateEmployeeChoiceList(): void {
        this.filteredEmployeeChoiceList = [];
        this.employeeChoiceList.forEach((employee) => {
            employee.name.startsWith(this.filter) || (this.currentEmployee !== null && this.currentEmployee.id === employee.id)
                ? this.filteredEmployeeChoiceList.push(employee)
                : null;
        });
    }
    // update leavePlanList for an employee
    updateLeavePlanList(): void {
        this.currentLeavePlanList = [];
        this.activeLeavePlan = null;
        this.filter = "";
        this.filteredEmployeeChoiceList = this.employeeChoiceList;
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
    async refreshEmployeeData(): Promise<void> {
        this.isLoading = true;
        await this.serviceAdapter.initializeData();
        this.updateLeavePlanList();
    }
}
