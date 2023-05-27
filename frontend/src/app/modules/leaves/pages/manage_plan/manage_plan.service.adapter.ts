import { DataStorage } from "@classes/data-storage";
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
    async initializeData(): Promise<void> {
        this.vm.isLoading = true;
        Promise.all([this.vm.genericService.getObjectList({ leaves_app: "SchoolLeavePlan" }, { filter: {
            parentSchool: this.vm.user.activeSchool.dbId
        } }), this.vm.genericService.getObjectList({ leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, { filter: {
            parentSchoolLeavePlan__parentSchool__id: this.vm.user.activeSchool.dbId
        } }), this.vm.genericService.getObjectList({ leaves_app: "SchoolLeaveType" }, { filter: {
            parentSchool: this.vm.user.activeSchool.dbId
        } })]).then((results) => {
            [this.vm.leavePlanList, this.vm.leavePlanToLeaveTypeList, this.vm.leaveTypeList] = [results[0], results[1], results[2]];
            this.vm.leavePlanList.sort((leavePlanA, leavePlanB) => leavePlanA.leavePlanName < leavePlanB.leavePlanName ? -1 : 1);
            this.vm.resetComponent();
            this.vm.isLoading = false;
        });
    }
    // ends :- Initialize Data

    // starts :- alert for duplicate entries
    async compareAndAlert(variableName, database, check, data): Promise<boolean> {
        // starts :- check for existing entry in the database by using Operation.check to compare 2 objects
        this.vm[variableName] = await this.vm.genericService.getObjectList(database, {});
        let sameVariableNameMap: { [id: string]: boolean } = {};
        const similarObjectList = this.vm[variableName].filter((object) => {
            const variableList = check(object, data);
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
            return true;
        }
        return false;
    }
    // ends :- alert for duplicate entries

    // starts :- Function to save plan
    async savePlan(data): Promise<any> {
        // starts :- Check if the current leave plan entered is valid or not.
        if (!data.leavePlanName.match(/[A-Za-z][A-Za-z0-9- ]*/g) || data.leavePlanName.match(/[A-Za-z][A-Za-z0-9- ]*/g).length !== 1) {
            return alert(
                "Please Enter a valid Leave Plan Name. (start with lowercase / uppercase english alphabets and contains only alphabets, numbers, spaces and hyphens.)",
            );
        }
        // ends :- End of check for leave plan name.
        this.vm.isLoading = true;
        // starts :- Create List for each leave type inside currentLeavePlan (leave types to be deleted and leave types to be added)
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
                ? addLeaveTypeChoiceList.push({ id: -1, parentSchoolLeavePlan: this.vm.currentLeavePlan.id, parentSchoolLeaveType: leaveType.id }) : null;
        });
        if (await this.compareAndAlert("leavePlanList", { leaves_app: "SchoolLeavePlan" },
        (data1, data2) => data2.id != data1.id && data1.leavePlanName.toLowerCase() === data2.leavePlanName.toLowerCase() ? ["Leave Plan Name"] : [], data)) {
            this.vm.isLoading = false;
            return false;
        }
        // ends :- Create List of leave types.
        // starts :- Make requests to update leave plan name, delete leave types and add leave types
        data.parentSchool = this.vm.user.activeSchool.dbId;
        data.id
        ? await this.vm.genericService.partiallyUpdateObject({ leaves_app: "SchoolLeavePlan" }, data)
        : await this.vm.genericService.createObject({ leaves_app: "SchoolLeavePlan" }, data);
        removeLeaveTypeChoiceList.length ?
        await this.vm.genericService.deleteObjectList({ leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, { filter: { __or__: removeLeaveTypeChoiceList } })
        : null;
        addLeaveTypeChoiceList.length ?
        await this.vm.genericService.createObjectList({ leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, addLeaveTypeChoiceList) : null;
        // ends :- Request changes
        this.initializeData();
    }
    // ends :- function to save plan

    // starts :- Function to delete currently selected plan
    async handleDelete(): Promise<any> {
        let oldLeaveTypeChoiceList: Array<LeavePlanToLeaveType> = [];
        this.vm.isLoading = true;
        this.vm.leavePlanToLeaveTypeList.map((leavePlanToLeaveTypeItem) => {
            leavePlanToLeaveTypeItem.parentSchoolLeavePlan === this.vm.currentLeavePlan.id ? oldLeaveTypeChoiceList.push(leavePlanToLeaveTypeItem) : null;
        });
        oldLeaveTypeChoiceList.length
        ? await this.vm.genericService.deleteObjectList({ leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, { filter: { __or__: oldLeaveTypeChoiceList } })
        : null;
        await this.vm.genericService.deleteObjectList({ leaves_app: "SchoolLeavePlan" }, { filter: this.vm.currentLeavePlan });
        this.initializeData();
    }
    // ends :- Function to delete currently selected plan
}