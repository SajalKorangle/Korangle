import { DataStorage } from "@classes/data-storage";
import { ManagePlanComponent } from "./manage_plan.component";

export default class ManagePlanServiceAdapter {
    vm: ManagePlanComponent;
    initializeAdapter(vm: ManagePlanComponent): void {
        this.vm = vm;
        this.vm.user = DataStorage.getInstance().getUser();
    }
    async initializeData(): Promise<void> {
        this.vm.leavePlanList = await this.vm.genericService.getObjectList(
            { leaves_app: "SchoolLeavePlan" },
            { filter: { parentSchool: this.vm.user.activeSchool.dbId } },
        );
        this.vm.leavePlanToLeaveTypeList = await this.vm.genericService.getObjectList(
            { leaves_app: "SchoolLeavePlanToSchoolLeaveType" },
            { filter: { parentSchoolLeavePlan__parentSchool__id: this.vm.user.activeSchool.dbId } },
        );
        this.vm.leaveTypeList = await this.vm.genericService.getObjectList(
            { leaves_app: "SchoolLeaveType" },
            { filter: { parentSchool: this.vm.user.activeSchool.dbId } },
        );
        this.vm.isLoading = false;
    }
    async handleDataChange(data, operation): Promise<any> {
        this.vm.isLoading = true;
        if (operation === "insert" || operation === "update") {
            this.vm.leavePlanList = await this.vm.genericService.getObjectList({ leaves_app: "SchoolLeavePlan" }, {});
            const similarObjectList = this.vm.leavePlanList.filter((leavePlan) => {
                return data.id != leavePlan.id && leavePlan.leavePlanName.toString().toLowerCase() === data.leavePlanName.toString().toLowerCase();
            });
            if (similarObjectList.length != 0) {
                let isNameSame: boolean = false;
                similarObjectList.map((similarObject) => {
                    isNameSame = isNameSame || similarObject.leavePlanName.toString().toLowerCase() === data.leavePlanName.toString().toLowerCase();
                });
                alert(`${isNameSame ? "Plan Name" : ""} already exists!`);
                this.vm.isLoading = false;
                return null;
            }
        }
        let response = null;
        data.parentSchool = this.vm.user.activeSchool.dbId;
        if (operation === "insert") {
            response = await this.vm.genericService.createObject({ leaves_app: "SchoolLeavePlan" }, data);
        } else if (operation === "update") {
            response = await this.vm.genericService.partiallyUpdateObject({ leaves_app: "SchoolLeavePlan" }, data);
        } else if (operation === "delete") {
            response = await this.vm.genericService.deleteObjectList({ leaves_app: "SchoolLeavePlan" }, { filter: data });
        } else if (operation === "insertBatch") {
            response = await this.vm.genericService.createObjectList({ leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, data);
        } else if (operation === "deleteBatch") {
            response = await this.vm.genericService.deleteObjectList({ leaves_app: "SchoolLeavePlanToSchoolLeaveType" }, { filter: { __or__: data } });
        }
        if (response !== null) {
            await this.initializeData();
        }
        this.vm.isLoading = false;
        return response;
    }
}
