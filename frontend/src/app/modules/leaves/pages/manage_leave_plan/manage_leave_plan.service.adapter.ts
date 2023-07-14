import { DataStorage } from "@classes/data-storage";
import { Operation } from "@modules/leaves/classes/operation";
import { ManageLeavePlanComponent } from "./manage_leave_plan.component";
import { EmployeeLeaveType, LeaveType } from "@modules/leaves/classes/leaves";

export default class ManageLeavePlanServiceAdapter {
    vm: ManageLeavePlanComponent;

    // starts :- Initialize adapter (initialize adapter with instance of component)
    initializeAdapter(vm: ManageLeavePlanComponent): void {
        this.vm = vm;
        this.vm.user = DataStorage.getInstance().getUser();
    }
    // ends :- Initialize adapter

    // starts :- Initialize Data (send GET request to backend to fetch data)
    async initializeData(): Promise<void> {
        this.vm.isLoading = true;
        let results = await Promise.all([
            this.vm.genericService.getObjectList(
                { employee_app: "Employee" },
                {
                    filter: { parentSchool: this.vm.user.activeSchool.dbId },
                }
            ),
            this.vm.genericService.getObjectList(
                { leaves_app: "SchoolLeavePlanToEmployee" },
                {
                    filter: {
                        parentSchoolLeavePlan__parentSchool: this.vm.user.activeSchool.dbId,
                    },
                }
            ),
            this.vm.genericService.getObjectList(
                { leaves_app: "SchoolLeavePlan" },
                {
                    filter: { parentSchool: this.vm.user.activeSchool.dbId },
                }
            ),
            this.vm.genericService.getObjectList(
                { leaves_app: "EmployeeLeaveType" },
                {
                    filter: { parentLeaveType__parentSchool: this.vm.user.activeSchool.dbId },
                }
            ),
            this.vm.genericService.getObjectList(
                { leaves_app: "SchoolLeaveType" },
                {
                    filter: { parentSchool: this.vm.user.activeSchool.dbId },
                }
            ),
        ]);
        // prettier-ignore
        [this.vm.employeeChoiceList, this.vm.leavePlanToEmployeeList, this.vm.leavePlanList, this.vm.employeeLeaveTypeList, this.vm.leaveTypeList] = [
            results[0], results[1], results[2], results[3], results[4],
        ];
        this.vm.employeeChoiceList.sort((a, b) => a.name.localeCompare(b.name));
        this.vm.filteredEmployeeChoiceList = this.vm.employeeChoiceList;
        this.vm.currentEmployee = this.vm.currentEmployee
            ? this.vm.employeeChoiceList.find((employee) => employee.id == this.vm.currentEmployee.id)
            : this.vm.currentEmployee;
        this.vm.currentEmployee ? this.vm.updateLeavePlanList() : null;
        this.vm.isLoading = false;
    }
    // ends :- Initialize Data

    // starts :- Data Change Handler (handle Data changes by making requests to backend)
    async handleDataChange(Operation: Operation, variableName: string): Promise<any> {
        this.vm.isLoading = true;
        if (Operation.operation === "insert" || Operation.operation === "update") {
            // starts :- check for existing entry in the database by using Operation.check to compare 2 objects
            this.vm[variableName] = await this.vm.genericService.getObjectList(Operation.database, {});
            let sameVariableNameMap: { [id: string]: boolean } = {};
            const similarObjectList = this.vm[variableName].filter((object) => {
                const variableList = Operation.check(object, Operation.data[0]);
                variableList.map((variableName) => {
                    sameVariableNameMap[variableName] = true;
                });
                return variableList.length !== 0;
            });
            // ends :- check for duplicate entry
            // starts :- Alert if data is duplicate using list of variables provided in sameVariableNameList
            if (similarObjectList.length !== 0) {
                let alertString: string = "";
                const sameVariableNameList = Object.keys(sameVariableNameMap);
                sameVariableNameList.map((variableName, index) => {
                    alertString += `${index === sameVariableNameList.length - 1 && sameVariableNameList.length !== 1 ? "and " : ""}${variableName}${
                        index === sameVariableNameList.length - 1 ? "" : ", "
                    }`;
                });
                alert(`${alertString} already exists!`);
                this.vm.isLoading = false;
                return null;
            }
            // ends :- alert for duplicate entry (returns null indicating error else moves ahead.)
        }
        let response = null;
        if (Operation.operation === "insert") {
            response = await this.vm.genericService.createObject(Operation.database, Operation.data[0]);
        } else if (Operation.operation === "update") {
            response = await this.vm.genericService.partiallyUpdateObject(Operation.database, Operation.data[0]);
        } else if (Operation.operation === "delete") {
            response = await this.vm.genericService.deleteObjectList(Operation.database, { filter: Operation.data[0] });
        } else if (Operation.operation === "insertBatch") {
            response = await this.vm.genericService.createObjectList(Operation.database, Operation.data);
        } else if (Operation.operation === "updateBatch") {
            response = await this.vm.genericService.partiallyUpdateObjectList(Operation.database, Operation.data);
        } else if (Operation.operation === "deleteBatch") {
            response = await this.vm.genericService.deleteObjectList(Operation.database, { filter: { __or__: Operation.data } });
        }
        if (response !== null) {
            await this.initializeData();
        }
        this.vm.isLoading = false;
        return response;
    }
    // ends :- Data Change Handler

    // starts :- function to apply leave plan on an employee
    async applyLeavePlan(): Promise<void> {
        const parentLeavePlanToEmployee = this.vm.leavePlanToEmployeeList.find((x) => x.parentEmployee == this.vm.currentEmployee.id);
        // prettier-ignore
        let response = await this.handleDataChange({
                check: (_, __) => [], database: { leaves_app: "SchoolLeavePlanToEmployee" }, operation: this.vm.activeLeavePlan === null ? "insert" : "update",
                data: [{
                        id: parentLeavePlanToEmployee ? parentLeavePlanToEmployee.id : -1,
                        parentEmployee: this.vm.currentEmployee.id, parentSchoolLeavePlan: this.vm.currentLeavePlan.id,
                        isCustomized: false, leavePlanName: this.vm.currentLeavePlan.leavePlanName,
                    }, ],
            }, "leavePlanToEmployeeList");
        if (response) {
            alert("Leave-Plan updated successfully");
        } else {
            alert("Failed to update Leave-Plan.");
        }
    }
    // ends :- function to apply leave plan

    // starts :- function to save leave type associated to this leave plan and employee
    async saveLeaveTypes(): Promise<void> {
        if (
            this.vm.currentLeavePlan !== null &&
            confirm("Do you want to update the leave types? (This operation might alter this plan to customized / stock for the selected employee)")
        ) {
            this.vm.isLoading = true;
            let insertList = this.vm.currentLeaveTypeList
                .filter((leaveType) => !this.vm.selectedEmployeeLeaveTypeList.find((employeeLeaveType) => employeeLeaveType.parentLeaveType == leaveType.id))
                .map((leaveType) => {
                    // prettier-ignore
                    return {
                        id: -1, parentLeaveType: leaveType.id, parentEmployee: this.vm.currentEmployee.id,
                        leaveTypeName: leaveType.leaveTypeName, leaveType: leaveType.leaveType, color: leaveType.color,
                    };
                });
            let deleteList = this.vm.selectedEmployeeLeaveTypeList.filter(
                (employeeLeaveType) => !this.vm.currentLeaveTypeList.find((leaveType) => leaveType.id == employeeLeaveType.parentLeaveType)
            );
            // prettier-ignore
            let response = insertList.length
                ? this.handleDataChange({
                        check: null, data: insertList, operation: "insertBatch",
                        database: { leaves_app: "EmployeeLeaveType" },
                    }, null) : true;
            if (response) {
                // prettier-ignore
                response = deleteList.length
                    ? this.handleDataChange({
                            check: null, data: deleteList, operation: "deleteBatch",
                            database: { leaves_app: "EmployeeLeaveType" },
                        }, null ) : true;
                response ? alert("Leave Types updated successfully") : alert("Failed to update Leave Types.");
            } else {
                alert("Failed to update Leave Types.");
            }
            this.vm.isLoading = false;
        }
    }
    // ends :- function to save leave type associated to this leave plan and employee

    // starts :- function to delete a specific employee leave type
    async deleteLeaveType(employeeLeaveType: EmployeeLeaveType): Promise<void> {
        this.vm.isLoading = true;
        // prettier-ignore
        let response = await this.handleDataChange({
                check: null, data: [employeeLeaveType], operation: "deleteBatch",
                database: { leaves_app: "EmployeeLeaveType" },
            }, null);
        if (response) {
            this.vm.updateLeavePlanList();
            alert("Leave Type removed successfully.");
        } else {
            alert("Unable to delete Leave Type.");
            this.vm.isLoading = false;
        }
    }
    // ends :- function to delete a specific employee leave type
}
