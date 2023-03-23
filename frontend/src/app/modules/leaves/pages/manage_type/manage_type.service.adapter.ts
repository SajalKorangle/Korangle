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
    async initializeData(database: { [id: string]: string }, variableName: string): Promise<void> {
        this.vm[variableName] = await this.vm.genericService.getObjectList(database, {});
        this.vm.isLoading = false;
    }
    // ends :- Initialize Data

    // starts :- Data Change Handler (handle Data changes by making requests to backend, single function to handle data change with specifying the operation type.)
    async handleDataChange(Operation: Operation, variableName: string): Promise<any> {
        this.vm.isLoading = true;
        if (
            Operation.operation === "insert" ||
            Operation.operation === "update" ||
            Operation.operation === "insertBatch" ||
            Operation.operation === "updateBatch"
        ) {
            this.vm[variableName] = await this.vm.genericService.getObjectList(Operation.database, {});
            let sameVariableNameMap: { [id: string]: boolean } = {};
            const similarObjectList = this.vm[variableName].filter((object) => {
                const variableList = Operation.check(object, Operation.data);
                variableList.map((variableName) => {
                    sameVariableNameMap[variableName] = true;
                });
                return variableList.length !== 0;
            });
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
        }
        let response = null;
        Operation.data.parentSchool = this.vm.user.activeSchool.dbId;
        if (Operation.operation === "insert") {
            response = await this.vm.genericService.createObject(Operation.database, Operation.data);
        } else if (Operation.operation === "update") {
            response = await this.vm.genericService.partiallyUpdateObject(Operation.database, Operation.data);
        } else if (Operation.operation === "delete") {
            response = await this.vm.genericService.deleteObjectList(Operation.database, { filter: Operation.data });
        } else if (Operation.operation === "insertBatch") {
            response = await this.vm.genericService.createObjectList(Operation.database, Operation.data);
        } else if (Operation.operation === "updateBatch") {
            response = await this.vm.genericService.partiallyUpdateObjectList(Operation.database, Operation.data);
        }
        if (response !== null) {
            await this.initializeData(Operation.database, variableName);
        }
        this.vm.isLoading = false;
        return response;
    }
    // ends :- Data Change Handler
}
