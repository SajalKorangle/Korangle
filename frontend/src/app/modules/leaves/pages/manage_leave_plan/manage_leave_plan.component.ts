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
    // employee Choice List
    employeeChoiceList: Array<any> = [];
    filteredEmployeeChoiceList: Array<any> = [];
    currentEmployee: any = null;
    filter: string = "";
    // Active Leave Plans for an employee
    leavePlanToEmployeeList: Array<LeavePlanToEmployee> = [];
    // active Leave Plan
    activeLeavePlan: LeavePlan = null;
    currentLeavePlan: LeavePlan = null;

    // starts :- function to update list of employees
    updateEmployeeChoiceList(): void {
        this.filteredEmployeeChoiceList = [];
        this.employeeChoiceList.forEach((employee) => {
            employee.name.toLowerCase().startsWith(this.filter.toLowerCase()) ? this.filteredEmployeeChoiceList.push(employee) : null;
        });
        if (this.filteredEmployeeChoiceList.length == 0) {
            this.filteredEmployeeChoiceList = this.employeeChoiceList;
        }
    }
    // ends :- function to update list of employees

    // starts :- function to update leavePlanList for an employee
    updateLeavePlanList(): void {
        this.activeLeavePlan = null;
        this.filter = "";
        this.filteredEmployeeChoiceList = this.employeeChoiceList;
        const employeeLeavePlan = this.leavePlanToEmployeeList.find((leavePlanToEmployee) => leavePlanToEmployee.parentEmployee === this.currentEmployee.id);
        this.activeLeavePlan = employeeLeavePlan ? this.leavePlanList.find((leavePlan) => leavePlan.id === employeeLeavePlan.parentSchoolLeavePlan) : null;
        this.currentLeavePlan = this.activeLeavePlan;
    }
    // ends :- function to update leavePlanList for an employee

    // starts :- function to refresh data.
    refreshEmployeeData(): void {
        alert("Under Construction!");
    }
    // ends :- function to refresh data.
}
