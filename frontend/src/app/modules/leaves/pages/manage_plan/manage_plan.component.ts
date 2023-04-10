import { Component, OnInit } from "@angular/core";
import { User } from "@classes/user";
import { GenericService } from "@services/generic/generic-service";
import { LeavePlan, LeavePlanToEmployee, LeavePlanToLeaveType, LeaveType } from "@modules/leaves/classes/leaves";
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
        this.serviceAdapterGeneric.initializeData({ leaves_app: "SchoolLeavePlanToEmployee" }, "leavePlanToEmployeeList", {
            filter: { parentSchoolLeavePlan__parentSchool__id: this.user.activeSchool.dbId },
        });
        this.serviceAdapterGeneric.initializeData({ leaves_app: "SchoolLeaveType" }, "leaveTypeList", {
            filter: { parentSchool: this.user.activeSchool.dbId },
        });
        this.serviceAdapterGeneric.initializeData({ employee_app: "Employee" }, "employeeChoiceList", {
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
    // employee choices
    employeeChoiceList: Array<any> = [];
    currentEmployeeChoiceList: Array<any> = [];
    appliedEmployeeChoiceList: Array<any> = [];
    filteredEmployeeChoiceList: Array<any> = [];
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
    resetComponent(): void {
        this.currentLeavePlan = {};
        this.isLeavePlanOpen = this.isSelectLeavePlanToLeaveTypeVisible = this.isAddNewOpen = false;
        this.leavePlanName = "";
        this.leaveTypeChoiceList = this.currentLeaveTypeChoiceList = this.appliedLeaveTypeChoiceList = [];
        this.currentEmployeeChoiceList = this.appliedEmployeeChoiceList = [];
    }
    async savePlan(data): Promise<any> {
        this.isLoading = true;
        // create arrays representing leave types to be added and deleted
        let removeLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        let addLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        let oldLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        // create arrays representing employees to be added and deleted
        let removeEmployeeChoiceList: Array<LeavePlanToEmployee> = [];
        let addEmployeeChoiceList: Array<LeavePlanToEmployee> = [];
        let oldEmployeeChoiceList: Array<LeavePlanToEmployee> = [];
        // create original array of leave types associated to this leave plan
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id ? oldLeaveTypeChoiceList.push(leavePlanToLeaveTypeItem) : null;
        });
        // create original array of employees associated to this leave plan
        this.leavePlanToEmployeeList.map((leavePlanToEmployee) => {
            leavePlanToEmployee.parentSchoolLeavePlan === this.currentLeavePlan.id ? oldEmployeeChoiceList.push(leavePlanToEmployee) : null;
        });
        // create array of leave types to be removed
        oldLeaveTypeChoiceList.map((oldLeaveTypeChoice) => {
            let similarLeaveType = this.appliedLeaveTypeChoiceList.find((leaveType) => {
                return leaveType.id === oldLeaveTypeChoice.parentSchoolLeaveType;
            });
            !similarLeaveType ? removeLeaveTypeChoiceList.push(oldLeaveTypeChoice) : null;
        });
        // create array of employees to be removed
        oldEmployeeChoiceList.map((oldEmployeeChoice) => {
            let similarEmployee = this.appliedEmployeeChoiceList.find((employee) => employee.id === oldEmployeeChoice.parentEmployee);
            !similarEmployee ? removeEmployeeChoiceList.push(oldEmployeeChoice) : null;
        });
        // create array of leave types to be added
        this.appliedLeaveTypeChoiceList.map((leaveType) => {
            let similarLeaveType = oldLeaveTypeChoiceList.find((oldLeaveTypeChoice) => leaveType.id === oldLeaveTypeChoice.parentSchoolLeaveType);
            !similarLeaveType ? addLeaveTypeChoiceList.push({ id: -1,
                parentSchoolLeavePlan: this.currentLeavePlan.id, parentSchoolLeaveType: leaveType.id, }) : null;
        });
        // create array of employees to be added
        this.appliedEmployeeChoiceList.map((employee) => {
            let similarEmployee = oldEmployeeChoiceList.find((oldEmployeeChoice) => oldEmployeeChoice.parentEmployee === employee.id);
            !similarEmployee ? addEmployeeChoiceList.push({id: -1,
                parentSchoolLeavePlan: this.currentLeavePlan.id, parentEmployee: employee.id, }) : null;
        });
        // update the leave plan
        await this.serviceAdapterGeneric.handleDataChange({
                check: (data1, data2) => {
                    return (data2.id != data1.id && data1.leavePlanName.toString().toLowerCase() === data2.leavePlanName.toString().toLowerCase()) ? ["Leave Plan Name"] : [];
                },
                data: [data], database: { leaves_app: "SchoolLeavePlan" }, operation: data.id ? "update" : "insert",
            }, "leavePlanList");
        // remove deleted leave types
        removeLeaveTypeChoiceList.length ? await this.serviceAdapterGeneric.handleDataChange({
                check: null,
                data: removeLeaveTypeChoiceList, database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, operation: "deleteBatch",
            }, "leavePlanToLeaveTypeList") : null;
        // remove un-associated with this leave plan
        removeEmployeeChoiceList.length ? await this.serviceAdapterGeneric.handleDataChange({
            check: null, data: removeEmployeeChoiceList, database: {leaves_app: "SchoolLeavePlanToEmployee"}, operation: "deleteBatch"
        }, "leavePlanToEmployeeList") : null;
        // add new leave types
        addLeaveTypeChoiceList.length ? await this.serviceAdapterGeneric.handleDataChange({
            check: null,
            data: addLeaveTypeChoiceList, database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, operation: "insertBatch",
        }, "leavePlanToLeaveTypeList") : null;
        // associate new employees to this leave plan
        addEmployeeChoiceList.length ? await this.serviceAdapterGeneric.handleDataChange({
            check: null, data: addEmployeeChoiceList, database: { leaves_app: "SchoolLeavePlanToEmployee" }, operation: "insertBatch",
        }, "leavePlanToEmployeeList") : null;
        // go back to list of leave plans
        this.resetComponent();
    }
    async handleDelete(): Promise<any> {
        let oldLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        let oldEmployeeChoiceList: Array<any> = [];
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id ? oldLeaveTypeChoiceList.push(leavePlanToLeaveTypeItem) : null;
        });
        this.leavePlanToEmployeeList.map((leavePlanToEmployee) => {
            leavePlanToEmployee.parentSchoolLeavePlan === this.currentLeavePlan.id ? oldEmployeeChoiceList.push(leavePlanToEmployee) : null;
        });
        if (oldLeaveTypeChoiceList.length) {
            await this.serviceAdapterGeneric.handleDataChange({
                    check: null, data: oldLeaveTypeChoiceList, database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, operation: "deleteBatch",
                }, "leavePlanToLeaveTypeList");
        }
        if (oldEmployeeChoiceList.length) {
            await this.serviceAdapterGeneric.handleDataChange({
                check: null, data: oldEmployeeChoiceList, database: {leaves_app: "SchoolLeavePlanToEmployee"}, operation: "deleteBatch"
            }, "leavePlanToEmployee");
        }
        await this.serviceAdapterGeneric.handleDataChange({
                check: null, data: [this.currentLeavePlan], database: { leaves_app: "SchoolLeavePlan" }, operation: "delete",
            }, "leavePlanList");
        this.resetComponent();
    }
    setPlan(leavePlan): void {
        this.isLeavePlanOpen = true;
        this.currentLeavePlan = leavePlan;
        this.appliedLeaveTypeChoiceList = [];
        this.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.currentLeavePlan.id ? this.appliedLeaveTypeChoiceList.push(
                this.leaveTypeList.find((leaveType) => leaveType.id === leavePlanToLeaveTypeItem.parentSchoolLeaveType),
            ) : null;
        });
        this.filteredEmployeeChoiceList = this.employeeChoiceList;
        this.appliedEmployeeChoiceList = [];
        this.leavePlanToEmployeeList.forEach((leavePlanToEmployee) => {
            leavePlanToEmployee.parentSchoolLeavePlan == this.currentLeavePlan.id ? this.appliedEmployeeChoiceList.push(
                this.employeeChoiceList.find((employee) => employee.id === leavePlanToEmployee.parentEmployee)
            ) : null;
        });
        this.currentEmployeeChoiceList = this.appliedEmployeeChoiceList;
        this.filter = "";
    }
    enableAddPlanToLeaveType(): void {
        this.isSelectLeavePlanToLeaveTypeVisible = true;
        this.updateChoiceList();
    }
    updateChoiceList(): void {
        this.leaveTypeChoiceList = [];
        this.leaveTypeList.map((leaveType) => {
            const similarChoices = this.appliedLeaveTypeChoiceList.filter((appliedLeaveType) => leaveType.id === appliedLeaveType.id);
            !similarChoices.length ? this.leaveTypeChoiceList.push(leaveType) : null;
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
            leaveTypeChoiceItem !== LeaveTypeChoice ? temporaryLeaveTypeChoiceList.push(leaveTypeChoiceItem) : null;
        });
        this.currentLeaveTypeChoiceList = temporaryLeaveTypeChoiceList;
        this.appliedLeaveTypeChoiceList = temporaryLeaveTypeChoiceList;
        this.updateChoiceList();
    }
    updateEmployeeChoiceList(): void {
        this.filteredEmployeeChoiceList = [];
        this.employeeChoiceList.forEach((employee) => {
            employee.name.startsWith(this.filter) || this.currentEmployeeChoiceList.includes(employee) ? this.filteredEmployeeChoiceList.push(employee) : null;
        });
    }
    removeEmployee(selectedEmployee): void {
        let temporaryEmployeeChoiceList = [];
        this.appliedEmployeeChoiceList.forEach((employee) => {
            employee.id === selectedEmployee.id ? null : temporaryEmployeeChoiceList.push(employee);
        });
        this.appliedEmployeeChoiceList = temporaryEmployeeChoiceList;
        this.currentEmployeeChoiceList = temporaryEmployeeChoiceList;
    }
}
