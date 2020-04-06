
import {DeleteEmployeeComponent} from './delete-employee.component';

export class DeleteEmployeeServiceAdapter {

    vm: DeleteEmployeeComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: DeleteEmployeeComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {

    }

    getEmployeeDetails(employee:any){
        this.vm.isLoading = true;
        let request_data = {
            'id' : employee.id
        };
        this.vm.employeeService.getObject(this.vm.employeeService.employees,request_data).then(val=>{
            this.vm.selectedEmployee = val;
            this.vm.isLoading = false;
        });
    }

}
