import { DataStorage } from "@classes/data-storage";
import { ManageTypeComponent } from "./manage_type.component";

export default class ManageTypeServiceAdapter {
    vm: ManageTypeComponent;

    initializeAdapter(vm: ManageTypeComponent): void {
        this.vm = vm;
        this.vm.user = DataStorage.getInstance().getUser();
    }

    async initializeData(): Promise<void> {
        this.vm.isLoading = true;
        this.vm.leaveTypeList = await this.vm.genericService.getObjectList({ leaves_app: "SchoolLeaveType" }, {});
        this.vm.isLoading = false;
    }

    async insertData(data): Promise<any> {
        data.parentSchool = this.vm.user.activeSchool.dbId;
        const response = await this.vm.genericService.createObject({ leaves_app: "SchoolLeaveType" }, data);
        if (response !== null) {
            await this.initializeData();
        }
        return response;
    }
    async updateData(data): Promise<any> {
        this.vm.isLoading = true;
        data.parentSchool = this.vm.user.activeSchool.dbId;
        const response = await this.vm.genericService.partiallyUpdateObject({ leaves_app: "SchoolLeaveType" }, data);
        if (response !== null) {
            await this.initializeData();
        }
        this.vm.isLoading = false;
        return response;
    }
    async deleteData(data): Promise<any> {
        this.vm.isLoading = true;
        data.parentSchool = this.vm.user.activeSchool.dbId;
        const response = await this.vm.genericService.deleteObjectList({ leaves_app: "SchoolLeaveType" }, { filter: data });
        if (response !== null) {
            await this.initializeData();
        }
        this.vm.isLoading = false;
        return response;
    }
}
