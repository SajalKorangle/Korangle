import { SettingsComponent } from './settings.component'

export class SettingsServiceAdapter {

    vm: SettingsComponent;
    constructor() {}
    dbId: any;
    // Data

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = false;
        this.vm.isUpdating = false;

    }
    
    getEmployeeAmount(employee: any): void{
        this.vm.isLoading = true;
        let employee_data = {
            parentEmployee: employee.id,
        }
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.employee_amount_permission, employee_data),
        ]).then(value =>{
            console.log(value);
            if(value[0].length > 0){
                this.vm.selectedEmployeeAmount = value[0][0].restrictedAmount;
                this.dbId = value[0][0].id;
            }
            else{
                this.vm.selectedEmployeeAmount = null;
                this.dbId = null;
            }
            this.vm.selectedEmployee = employee.id;
            this.vm.isLoading = false;
        })
    }

    changeAmountRestriction(): any{
        this.vm.isUpdating = true;
        if(this.dbId == null){
            let tempData = {
                parentEmployee: this.vm.selectedEmployee,
                restrictedAmount: this.vm.selectedEmployeeAmount,
            }
            console.log(tempData);
            Promise.all([
                this.vm.accountsService.createObject(this.vm.accountsService.employee_amount_permission, tempData),
            ]).then(value =>{
                this.dbId = value[0].id;
                this.vm.isUpdating = false;
            })
        }
        else{
            let tempData = {
                id: this.dbId,
                restrictedAmount: this.vm.selectedEmployeeAmount,
            }
            console.log(tempData);
            Promise.all([
                this.vm.accountsService.partiallyUpdateObject(this.vm.accountsService.employee_amount_permission, tempData),
            ]).then(value =>{
                this.vm.isUpdating = false;
            })
        }

    }
    
    
    

}
