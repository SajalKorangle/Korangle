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
        if (operation === "insert" || operation === "update") {
            this.vm.leaveTypeList = await this.vm.genericService.getObjectList({ leaves_app: "SchoolLeaveType" }, {});
            const similarObjectList = this.vm.leaveTypeList.filter((leaveType) => {
                return (
                    data.id != leaveType.id &&
                    (leaveType.leaveTypeName.toString().toLowerCase() === data.leaveTypeName.toString().toLowerCase() ||
                        leaveType.color.toString().toLowerCase() === data.color.toString().toLowerCase())
                );
            });
            if (similarObjectList.length != 0) {
                let isNameSame: boolean = false;
                let isColorSame: boolean = false;
                similarObjectList.map((similarObject) => {
                    isNameSame = isNameSame || similarObject.leaveTypeName.toString().toLowerCase() === data.leaveTypeName.toString().toLowerCase();
                    isColorSame = isColorSame || similarObject.color.toString().toLowerCase() === data.color.toString().toLowerCase();
                });
                alert(`${isNameSame ? "Name" : ""}${isColorSame ? (isNameSame ? " and Color" : "Color") : ""} already exists!`);
                this.vm.isLoading = false;
                return null;
            }
        }
        let response = null;
        data.parentSchool = this.vm.user.activeSchool.dbId;
        if (operation === "insert") {
            response = await this.vm.genericService.createObject({ leaves_app: "SchoolLeaveType" }, data);
        } else if (operation === "update") {
            response = await this.vm.genericService.partiallyUpdateObject({ leaves_app: "SchoolLeaveType" }, data);
        } else if (operation === "delete") {
            response = await this.vm.genericService.deleteObjectList({ leaves_app: "SchoolLeaveType" }, { filter: data });
        }
        if (response !== null) {
            await this.initializeData();
        }
        this.vm.isLoading = false;
        return response;
    }
}
