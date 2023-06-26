import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import ManageLeavePlanServiceAdapter from "./manage_leave_plan.service.adapter";
import { EmployeeLeavePlan, LeavePlan, LeavePlanToEmployee } from "@modules/leaves/classes/leaves";

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
    // leavePlans available for a specific employee
    leavePlanToEmployeeList: Array<LeavePlanToEmployee> = [];
    currentLeavePlanList: Array<LeavePlan> = [];
    // active Leave Plan
    activeLeavePlan: LeavePlan = null;
    employeeLeavePlanList: Array<EmployeeLeavePlan> = [];
    currentLeavePlan: LeavePlan = null;
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
        this.currentLeavePlan = this.activeLeavePlan;
    }
    refreshEmployeeData(): void {
        alert("Under Construction!");
    }
}
