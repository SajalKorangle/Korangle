import { DataStorage } from "@classes/data-storage";
import { Operation } from "@modules/leaves/classes/operation";
import { ManagePlanComponent } from "./manage_plan.component";
import { LeavePlanToLeaveType } from "@modules/leaves/classes/leaves";

export default class ManagePlanServiceAdapter {
    vm: ManagePlanComponent;

    // starts :- Initialize adapter (initialize adapter with instance of component)
    initializeAdapter(vm: ManagePlanComponent): void {
        this.vm = vm;
        this.vm.user = DataStorage.getInstance().getUser();
    }
    // ends :- Initialize adapter

    // starts :- Initialize Data (send GET request to backend to fetch data)
    async initializeData(database: { [id: string]: string }, variableName: string, stayOpen: boolean = false): Promise<void> {
        let Filter: { [id: string]: string } = {};
        Filter[this.vm.filterMap[variableName]] = this.vm.user.activeSchool.dbId;
        this.vm[variableName] = await this.vm.genericService.getObjectList(database, { filter: Filter });
        this.vm.isLoading = stayOpen;
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
            await this.initializeData(Operation.database, variableName);
        }
        this.vm.isLoading = false;
        return response;
    }
    // ends :- Data Change Handler

    // starts :- Function to save plan
    async savePlan(data): Promise<any> {
        if (!data.leavePlanName.match(/[A-Za-z][A-Za-z0-9- ]*/g) || data.leavePlanName.match(/[A-Za-z][A-Za-z0-9- ]*/g).length !== 1) {
            return alert(
                "Please Enter a valid Leave Plan Name. (start with lowercase / uppercase english alphabets and contains only alphabets, numbers, spaces and hyphens.)",
            );
        }
        let removeLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        let addLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        let oldLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        this.vm.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.vm.currentLeavePlan.id ? oldLeaveTypeChoiceList.push(leavePlanToLeaveTypeItem) : null;
        });
        oldLeaveTypeChoiceList.map((oldLeaveTypeChoice) => {
            let similarLeaveType = this.vm.appliedLeaveTypeChoiceList.find((leaveType) => {
                return leaveType.id === oldLeaveTypeChoice.parentSchoolLeaveType;
            });
            !similarLeaveType ? removeLeaveTypeChoiceList.push(oldLeaveTypeChoice) : null;
        });
        this.vm.appliedLeaveTypeChoiceList.map((leaveType) => {
            let similarLeaveType = oldLeaveTypeChoiceList.find((oldLeaveTypeChoice) => leaveType.id === oldLeaveTypeChoice.parentSchoolLeaveType);
            !similarLeaveType
                ? addLeaveTypeChoiceList.push({ id: -1, parentSchoolLeavePlan: this.vm.currentLeavePlan.id, parentSchoolLeaveType: leaveType.id })
                : null;
        });
        await this.handleDataChange({
                check: (data1, data2) => data2.id != data1.id && data1.leavePlanName.toLowerCase() === data2.leavePlanName.toLowerCase() ? ["Leave Plan Name"] : [],
                data: [data], database: { leaves_app: "SchoolLeavePlan" }, operation: data.id ? "update" : "insert",
            }, "leavePlanList",);
        removeLeaveTypeChoiceList.length
            ? await this.handleDataChange({
                      check: null, data: removeLeaveTypeChoiceList, operation: "deleteBatch",
                      database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" },
                  }, "leavePlanToLeaveTypeList",) : null;
        addLeaveTypeChoiceList.length ? await this.handleDataChange({
                      check: null, data: addLeaveTypeChoiceList, operation: "insertBatch",
                      database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" },
                  }, "leavePlanToLeaveTypeList",) : null;
        this.vm.resetComponent();
    }
    // ends :- function to save plan

    // starts :- Function to delete currently selected plan
    async handleDelete(): Promise<any> {
        let oldLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        this.vm.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.vm.currentLeavePlan.id ? oldLeaveTypeChoiceList.push(leavePlanToLeaveTypeItem) : null;
        });
        if (oldLeaveTypeChoiceList.length) {
            await this.handleDataChange({
                    check: null, data: oldLeaveTypeChoiceList, operation: "deleteBatch",
                    database: { leaves_app: "SchoolLeavePlanToSchoolLeaveType" },
                }, "leavePlanToLeaveTypeList");
        }
        await this.handleDataChange({
                check: null, data: [this.vm.currentLeavePlan], operation: "delete",
                database: { leaves_app: "SchoolLeavePlan" },
            }, "leavePlanList");
        this.vm.resetComponent();
    }
    // ends :- Function to delete currently selected plan
}