import { ViewEnquiryPermissionModalComponent } from "./view-enquiry-permission-modal.component";

export class ViewEnquiryPermissionModalService {
    vm: ViewEnquiryPermissionModalComponent;

    constructor() {}

    initializeAdapter(vm: ViewEnquiryPermissionModalComponent) {
        this.vm = vm;
    }

    async initializeData() {

        this.vm.isLoading = true;

        // Starts :- Fetching In Page Permissions
        this.vm.employeeInPagePermissions = await this.vm.genericService.getObject({enquiry_app: 'ViewEnquiryInPagePermissions'}, {
            filter: {
                parentEmployeePermission__parentEmployee: this.vm.employee.id
            }
        });
        // Ends :- Fetching In Page Permissions

        /* We are creating a record so that the default values always come from one place. */
        // Starts :- Creating a permission record if not present till now.
        if (!this.vm.employeeInPagePermissions) {
            await this.createNewPermissionRecord();
        }
        // Ends :- Creating a permission record if not present till now.

        this.vm.isLoading = false;
    }

    async createNewPermissionRecord() {
        this.vm.isLoading = true;
        let result = await this.vm.genericService.createObject({
            enquiry_app: 'ViewEnquiryInPagePermissions'
        }, {
            parentEmployeePermission: this.vm.parentEmployeePermission.id
        });
        this.vm.employeeInPagePermissions = result;
        this.vm.isLoading = false;
    }

    async apply() {
        this.vm.isLoading = true;
        await this.vm.genericService.updateObject({enquiry_app: 'ViewEnquiryInPagePermissions'}, this.vm.employeeInPagePermissions);
        this.vm.isLoading = false;
        this.vm.dialogRef.close();
    }

}
