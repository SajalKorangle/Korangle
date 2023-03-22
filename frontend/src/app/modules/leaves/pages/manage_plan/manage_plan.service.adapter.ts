import { DataStorage } from "@classes/data-storage";
import { ManagePlanComponent } from "./manage_plan.component";

export default class ManagePlanServiceAdapter {
    vm: ManagePlanComponent;
    initializeAdapter(vm: ManagePlanComponent): void {
        this.vm = vm;
        this.vm.user = DataStorage.getInstance().getUser();
    }
    async initializeData(): Promise<void> {
        this.vm.leavePlanList = await this.vm.genericService.getObjectList({ leaves_app: "SchoolLeavePlan" }, {});
        this.vm.leavePlanToLeaveTypeList = await this.vm.genericService.getObjectList({ leaves_app: "SchoolLeavePlanToSchoolLeaveType"}, {});
        this.vm.leaveTypeList = await this.vm.genericService.getObjectList({leaves_app: "SchoolLeaveType"}, {});
        console.log(this.vm.leaveTypeList);
        console.log(this.vm.leavePlanList);
        console.log(this.vm.leavePlanToLeaveTypeList);
        this.vm.isLoading = false;
    }
    async handleDataChange(data, operation): Promise<any> {
        this.vm.isLoading = true;
        if (operation === "insert") {
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
        }
        if (response !== null) {
            await this.initializeData();
        }
        this.vm.isLoading = false;
        return response;
    }
}
