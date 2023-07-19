import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import { LeavePlan, LeavePlanToEmployee, LeavePlanToLeaveType, LeaveType } from "@modules/leaves/classes/leaves";
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
    currentLeavePlan: LeavePlan | null = null;
    // employee choices
    employeeChoiceList: Array<any> = [];
    currentEmployeeChoiceList: Array<any> = [];
    appliedEmployeeChoiceList: Array<any> = [];
    filteredEmployeeChoiceList: Array<any> = [];
    availableEmployeeChoiceList: Array<any> = [];
    filter: string = "";
    // employee to leave Plan
    leavePlanToEmployeeList: Array<LeavePlanToEmployee> = [];
    // choices
    leaveTypeChoiceList: Array<LeaveType> = [];
    currentLeaveTypeChoiceList: Array<LeaveType> = [];
    appliedLeaveTypeChoiceList: Array<LeaveType> = [];
    // data variables
    leavePlanList: Array<LeavePlan> = [];
    leavePlanToLeaveTypeList: Array<LeavePlanToLeaveType> = [];
    leaveTypeList: Array<LeaveType> = [];

    // Initialize the generic service
    constructor(public genericService: GenericService) {}

    // Initialize the service adapter and get the data
    async ngOnInit(): Promise<void> {
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    // starts :- Function to reset the component
    // It is used when user clicks on go back or cancel.
    resetComponent(): void {
        this.currentLeavePlan = null;
        this.leavePlanName = "";
        this.isLeavePlanOpen = this.isSelectLeavePlanToLeaveTypeVisible = this.isAddNewOpen = false;
        this.leaveTypeChoiceList = this.currentLeaveTypeChoiceList = this.appliedLeaveTypeChoiceList = [];
        this.currentEmployeeChoiceList = this.appliedEmployeeChoiceList = [];
    }
    // ends :- Function to reset the component

    // starts :- Set the selected plan so that it can be updated and displayed on screen.
    setPlan(leavePlan): void {
        this.isLeavePlanOpen = true;
        this.currentLeavePlan = JSON.parse(JSON.stringify(leavePlan));
        this.appliedLeaveTypeChoiceList = [];
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id
                ? this.appliedLeaveTypeChoiceList.push(this.leaveTypeList.find((leaveType) => leaveType.id === leavePlanToLeaveTypeItem.parentSchoolLeaveType))
                : null;
        });
        this.filteredEmployeeChoiceList = this.employeeChoiceList.filter(
            (employee) => !this.doesEmployeeBelongToOtherLeavePlan(employee, this.currentLeavePlan.id)
        );
        this.availableEmployeeChoiceList = [...this.filteredEmployeeChoiceList];
        this.appliedEmployeeChoiceList = [];
        this.leavePlanToEmployeeList.forEach((leavePlanToEmployee) => {
            leavePlanToEmployee.parentSchoolLeavePlan == this.currentLeavePlan.id
                ? this.appliedEmployeeChoiceList.push(this.employeeChoiceList.find((employee) => employee.id === leavePlanToEmployee.parentEmployee))
                : null;
        });
        this.currentEmployeeChoiceList = this.appliedEmployeeChoiceList;
        this.filter = "";
        this.updateEmployeeChoiceList();
    }
    // ends :- Set the selected plan so that it can be updated and displayed on screen.

    // starts :- Display the form to add new leave plan
    enableAddPlanToLeaveType(): void {
        this.isSelectLeavePlanToLeaveTypeVisible = true;
        this.updateChoiceList();
    }
    // ends :- Display the form to add new leave plan

    // starts :- update leave types choices.
    updateChoiceList(): void {
        this.leaveTypeChoiceList = [];
        this.leaveTypeList.map((leaveType) => {
            !this.appliedLeaveTypeChoiceList.filter((appliedLeaveType) => leaveType.id === appliedLeaveType.id).length
                ? this.leaveTypeChoiceList.push(leaveType)
                : null;
        });
    }
    // ends :- update leave types choices.

    // starts :- save plan to leave type
    savePlanToLeaveType(LeavePlanToLeaveType): void {
        LeavePlanToLeaveType.length ? this.appliedLeaveTypeChoiceList.push(...LeavePlanToLeaveType) : null;
        this.currentLeaveTypeChoiceList = !LeavePlanToLeaveType.length ? this.appliedLeaveTypeChoiceList : this.currentLeaveTypeChoiceList;
        this.isSelectLeavePlanToLeaveTypeVisible = false;
        this.currentLeaveTypeChoiceList = [];
    }
    // ends :- save plan to leave type

    // starts :- remove leave type choice
    removeLeaveTypeChoice(LeaveTypeChoice): void {
        let temporaryLeaveTypeChoiceList: Array<LeaveType> = [];
        this.appliedLeaveTypeChoiceList.map((leaveTypeChoiceItem) => {
            leaveTypeChoiceItem !== LeaveTypeChoice ? temporaryLeaveTypeChoiceList.push(leaveTypeChoiceItem) : null;
        });
        this.currentLeaveTypeChoiceList = [];
        this.appliedLeaveTypeChoiceList = temporaryLeaveTypeChoiceList;
        this.updateChoiceList();
    }
    // ends :- remove leave type choice

    // starts :- update employee choices
    updateEmployeeChoiceList(): void {
        this.currentEmployeeChoiceList.sort((employee1, employee2) => employee1.name.localeCompare(employee2.name));
        this.filteredEmployeeChoiceList = [...this.currentEmployeeChoiceList];
        this.employeeChoiceList.forEach((employee) => {
            !this.currentEmployeeChoiceList.includes(employee) &&
            !this.doesEmployeeBelongToOtherLeavePlan(employee, this.currentLeavePlan.id)
                ? this.filteredEmployeeChoiceList.push(employee)
                : null;
        });
    }
    // ends :- update employee choices

    // starts :- function to get mode of employee visibility as per filter
    getEmployeeOptionVisibility(employee): string {
        return employee.name.toLowerCase().startsWith(this.filter.toLowerCase()) ? "flex" : "none";
    }
    // ends :- function to get mode of employee visibility as per filter

    // starts :- remove employee from list of selected employees.
    removeEmployee(selectedEmployee): void {
        let temporaryEmployeeChoiceList = [];
        this.appliedEmployeeChoiceList.forEach((employee) => {
            employee.id === selectedEmployee.id ? null : temporaryEmployeeChoiceList.push(employee);
        });
        this.appliedEmployeeChoiceList = temporaryEmployeeChoiceList;
        this.currentEmployeeChoiceList = temporaryEmployeeChoiceList;
    }
    // ends :- remove employee from list of selected employees.

    // starts :- add employee to list of selected employees.
    addEmployee(): void {
        let temporaryEmployeeChoiceList = [];
        this.appliedEmployeeChoiceList.forEach((employee) => {
            employee.name.toLowerCase().startsWith(this.filter.toLowerCase()) ? null : temporaryEmployeeChoiceList.push(employee);
        });
        this.currentEmployeeChoiceList.forEach((employee) => temporaryEmployeeChoiceList.push(employee));
        temporaryEmployeeChoiceList.sort((employee1, employee2) => employee1.name.localeCompare(employee2.name));
        this.filter = "";
        this.appliedEmployeeChoiceList = this.currentEmployeeChoiceList = temporaryEmployeeChoiceList;
        this.updateEmployeeChoiceList();
    }
    // ends :- add employee to list of selected employees.

    // starts :- function to check if employee belongs to other leave plan.
    doesEmployeeBelongToOtherLeavePlan(employee, leavePlanId): boolean {
        return this.leavePlanToEmployeeList.find(
            (leavePlanToEmployee) => leavePlanToEmployee.parentEmployee === employee.id && leavePlanToEmployee.parentSchoolLeavePlan !== leavePlanId
        )
            ? true
            : false;
    }
    // ends :- function to check if employee belongs to other leave plan.
}
