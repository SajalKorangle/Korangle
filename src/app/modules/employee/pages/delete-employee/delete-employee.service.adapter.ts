
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

}
