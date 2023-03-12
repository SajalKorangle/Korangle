import { ManageTypeComponent } from "./manage_type.component";

export default class ManageTypeServiceAdapter {
    vm: ManageTypeComponent;

    initializeAdapter(vm: ManageTypeComponent): void {
        this.vm = vm;
    }

    async initializeData(): Promise<void> {
        this.vm.isLoading = true;
        this.vm.leaveTypeList = await this.vm.genericService.getObjectList({ leaves_app: "SchoolLeaveType" }, {});
        this.vm.isLoading = false;
    }
}
