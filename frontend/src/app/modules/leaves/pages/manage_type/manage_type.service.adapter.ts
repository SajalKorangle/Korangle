import { DataStorage } from "@classes/data-storage";
import { ManageTypeComponent } from "./manage_type.component";

export default class ManageTypeServiceAdapter {
    vm: ManageTypeComponent;
    initializeAdapter(vm: ManageTypeComponent): void {
        this.vm = vm;
        this.vm.user = DataStorage.getInstance().getUser();
    }
    async initializeData(): Promise<void> {
        this.vm.leaveTypeList = await this.vm.genericService.getObjectList({ leaves_app: "SchoolLeaveType" }, {});
        this.vm.isLoading = false;
    }
    async handleDataChange(data, operation): Promise<any> {
        this.vm.isLoading = true;
        let response = null;
        data.parentSchool = this.vm.user.activeSchool.dbId;
        switch (operation) {
            case "insert": response = await this.vm.genericService.createObject({ leaves_app: "SchoolLeaveType" }, data);
                break;
            case "update": response = await this.vm.genericService.partiallyUpdateObject({ leaves_app: "SchoolLeaveType" }, data);
                break;
            case "delete": response = await this.vm.genericService.deleteObjectList({ leaves_app: "SchoolLeaveType" }, { filter: data });
                break;
        }
        if (response !== null) {
            await this.initializeData();
        }
        this.vm.isLoading = false;
        return response;
    }
}
