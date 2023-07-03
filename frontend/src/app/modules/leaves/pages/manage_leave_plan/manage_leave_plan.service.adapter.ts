import { DataStorage } from "@classes/data-storage";
import { Operation } from "@modules/leaves/classes/operation";
import { ManageLeavePlanComponent } from "./manage_leave_plan.component";

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
        ]);
        [this.vm.employeeChoiceList, this.vm.leavePlanToEmployeeList, this.vm.leavePlanList] = [results[0], results[1], results[2]];
        this.vm.employeeChoiceList.sort((a, b) => a.name.localeCompare(b.name));
        this.vm.filteredEmployeeChoiceList = this.vm.employeeChoiceList;
        this.vm.currentEmployee = null;
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
        if (!Operation.operation.endsWith("Batch")) {
            Operation.data.forEach((data) => {
                data.parentSchool = this.vm.user.activeSchool.dbId;
            });
        }
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
    //   {
    //     parentEmployee: number; parentSchoolLeavePlan: number; id: number;
    //     isCustomized: boolean; leavePlanName: string;
    // }
        let response = await this.handleDataChange(
            {
                check: (_, __) => [],
                data: [
                    {
                        parentEmployee: this.vm.currentEmployee.id,
                        parentSchoolLeavePlan: this.vm.currentLeavePlan.id,
                        isCustomized: true,
                        leavePlanName: this.vm.currentLeavePlan.leavePlanName,
                    },
                ],
                database: { leaves_app: "SchoolLeavePlanToEmployee" },
                operation: this.vm.activeLeavePlan === null ? "insert" : "update",
            },
            "leavePlanToEmployeeList"
        );
        if (response) {
            this.vm.activeLeavePlan = this.vm.currentLeavePlan;
            console.log(this.vm.activeLeavePlan);
            alert("Leave-Plan updated successfully");
        } else {
            alert("Failed to update Leave-Plan.");
        }
    }
    // ends :- function to apply leave plan
}
