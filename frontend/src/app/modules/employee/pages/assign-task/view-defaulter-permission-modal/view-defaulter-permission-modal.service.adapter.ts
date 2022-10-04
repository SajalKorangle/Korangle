import { ViewDefaulterPermissionModalComponent } from "./view-defaulter-permission-modal.component";

export class ViewDefaulterPermissionModalService {
    vm: ViewDefaulterPermissionModalComponent;

    constructor() {}

    initializeAdapter(vm: ViewDefaulterPermissionModalComponent){
        this.vm = vm;
    }

    async initializeData(){

        this.vm.isLoading = true;
        let value = await Promise.all([
            this.vm.genericService.getObject({ fees_third_app: 'ViewDefaulterPermissions' }, {
                filter: {
                    parentEmployeePermission__parentEmployee: this.vm.employee.id
                }
            }),         // 0
            this.vm.genericService.getObject({ employee_app: 'EmployeePermission' }, {
                filter: {
                    parentEmployee: this.vm.employee.id,
                    parentTask: 66
                }
            })          // 1
        ]);

        this.vm.employeePermissionList = value[0];
        this.vm.parentEmployeePermission = value[1];
        console.log(this.vm.employeePermissionList);
        console.log(this.vm.parentEmployeePermission);


        if(!this.vm.employeePermissionList){
            // create a permission record
            await this.createNewPermissionRecord();
        }
        
        this.vm.isLoading = false;
    }
    
    
    async createNewPermissionRecord(){
        console.log("Creating new record...");
        this.vm.isLoading = true;
        let result = await this.vm.genericService.createObject({
            fees_third_app: 'ViewDefaulterPermissions'
        }, {
            parentEmployeePermission: this.vm.parentEmployeePermission.id
        });
        this.vm.employeePermissionList = result;
        this.vm.isLoading = false;
    }

    async apply(){
        this.vm.isLoading = true;
        let result = await this.vm.genericService.updateObject({fees_third_app: 'ViewDefaulterPermissions'}, this.vm.employeePermissionList);
        this.vm.isLoading = false;
        this.vm.dialogRef.close();
    }

}