import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import GenericServiceAdapter from "../../leaves.service.adapter";
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
    serviceAdapterGeneric: GenericServiceAdapter = new GenericServiceAdapter();
    constructor(public genericService: GenericService) {}
    async ngOnInit(): Promise<void> {
        this.serviceAdapterGeneric.initializeAdapter(this);
        await this.serviceAdapterGeneric.initializeData({ employee_app: "Employee" }, "employeeChoiceList", {
            filter: { parentSchool: this.user.activeSchool.dbId },
        });
        await this.serviceAdapterGeneric.initializeData({ leaves_app: "SchoolLeavePlanToEmployee" }, "leavePlanToEmployeeList", {
            filter: { parentSchoolLeavePlan__parentSchool: this.user.activeSchool.dbId },
        });
        await this.serviceAdapterGeneric.initializeData({ leaves_app: "SchoolLeavePlan" }, "leavePlanList", {
            filter: { parentSchool: this.user.activeSchool.dbId },
        });
        await this.serviceAdapterGeneric.initializeData({ leaves_app: "EmployeeLeavePlan" }, "employeeLeavePlanList", {
            filter: { activeLeavePlan__parentSchool: this.user.activeSchool.dbId },
        });
        this.filteredEmployeeChoiceList = this.employeeChoiceList;
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
    async applyLeavePlan(): Promise<void> {
        let response = await this.serviceAdapterGeneric.handleDataChange(
            {
                check: (data1, data2) => {
                    return [];
                },
                data: [
                    {
                        id:
                            this.activeLeavePlan === null
                                ? -1
                                : this.employeeLeavePlanList.find((employeeLeavePlan) => employeeLeavePlan.activeLeavePlan === this.activeLeavePlan.id).id,
                        activeLeavePlan: this.currentLeavePlan.id,
                        parentEmployee: this.currentEmployee.id,
                    },
                ],
                database: { leaves_app: "EmployeeLeavePlan" },
                operation: this.activeLeavePlan === null ? "insert" : "update",
            },
            "employeeLeavePlanList",
        );
        if (response) {
            this.activeLeavePlan = this.currentLeavePlan;
            alert("Leave-Plan updated successfully");
        }
    }
}
