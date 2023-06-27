import { DataStorage } from "@classes/data-storage";
import { Operation } from "@modules/leaves/classes/operation";
import { ManageTypeComponent } from "./manage_type.component";

export default class ManageTypeServiceAdapter {
    vm: ManageTypeComponent;

    // starts :- Initialize adapter (initialize adapter with instance of component)
    initializeAdapter(vm: ManageTypeComponent): void {
        this.vm = vm;
        this.vm.user = DataStorage.getInstance().getUser();
    }
    // ends :- Initialize adapter

    // starts :- Initialize Data (send GET request to backend to fetch data)
    async initializeData(): Promise<void> {
        this.vm.isLoading = true;
        Promise.all([
            this.vm.genericService.getObjectList({ leaves_app: "SchoolLeaveType" }, { filter: { parentSchool: this.vm.user.activeSchool.dbId } }),
            this.vm.genericService.getObjectList(
                { leaves_app: "SchoolLeaveTypeMonth" },
                { filter: { parentSchoolLeaveType__parentSchool: this.vm.user.activeSchool.dbId } },
            ),
            this.vm.genericService.getObjectList(
                { leaves_app: "SchoolLeavePlanToSchoolLeaveType" },
                { filter: { parentSchoolLeavePlan__parentSchool: this.vm.user.activeSchool.dbId } },
            ),
        ]).then((results) => {
            [this.vm.leaveTypeList, this.vm.leaveTypeMonthList, this.vm.leavePlanToLeaveTypeList] = [results[0], results[1], results[2]];
            this.vm.leaveTypeList.sort((a, b) => a.leaveTypeName.localeCompare(b.leaveTypeName));
            this.vm.isLoading = false;
        });
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

    async saveLeaveType(data): Promise<any> {
        if (confirm("Do you want to continue?")) {
            data[0].parentSchool = this.vm.user.activeSchool.dbId;
            let response = await this.handleDataChange(
                {
                    check: (data1, data2) => {
                        let sameVariables = [];
                        if (data1.id !== data2.id && data1.leaveTypeName.toLowerCase() === data2.leaveTypeName.toLowerCase()) sameVariables.push("Name");
                        else if (data1.id != data2.id && data1.color.toLowerCase() === data2.color.toLowerCase()) sameVariables.push("Color");
                        return sameVariables;
                    },
                    data: [data[0]],
                    database: { leaves_app: "SchoolLeaveType" },
                    operation: data[0].id == -1 ? "insert" : "update",
                },
                "leaveTypeList",
            );
            if (response && JSON.stringify(response) != "{}") {
                data[0] = response;
                data[1].forEach((leaveTypeMonth) => {
                    leaveTypeMonth.parentSchoolLeaveType = response.id;
                });
                response = await this.handleDataChange(
                    {
                        check: null,
                        data: data[1],
                        database: { leaves_app: "SchoolLeaveTypeMonth" },
                        operation: data[1][0].id == -1 ? "insertBatch" : "updateBatch",
                    },
                    null,
                );
                if (response && JSON.stringify(response) != "{}") {
                    alert("Leave Type saved successfully");
                } else {
                    alert("Unable to save Leave Type. Rolling back...");
                    await this.handleDataChange(
                        {
                            check: null,
                            data: [data[0]],
                            database: { leaves_app: "SchoolLeaveType" },
                            operation: "delete",
                        },
                        null,
                    );
                    alert("Please try again later");
                }
            }
        }
    }

    async deleteType(event, schoolLeaveType): Promise<any> {
        if (this.vm.leavePlanToLeaveTypeList.find((leavePlanToLeaveType) => leavePlanToLeaveType.parentSchoolLeaveType === schoolLeaveType.id)) {
            return alert("This Leave type cannot be deleted since it's used in Leave Plan");
        }
        if (confirm("Do you want to delete this leave type?")) {
            this.vm.currentSchoolLeaveType = schoolLeaveType;
            let response = await this.handleDataChange(
                {
                    database: { leaves_app: "SchoolLeaveType" },
                    operation: "delete",
                    check: null,
                    data: [this.vm.currentSchoolLeaveType],
                },
                null,
            );
            if (response && JSON.stringify(response) !== "{}") {
                alert("Leave Type deleted successfully");
            } else {
                alert("Unable to delete Leave Type.");
            }
        }
    }
}
