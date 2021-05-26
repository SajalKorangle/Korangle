import {StudentPermissionComponent} from './student-permission.component';

export class StudentPermissionUserInput {

    vm: StudentPermissionComponent;

    constructor() { }

    initialize(vm: StudentPermissionComponent): void {
        this.vm = vm;
    }

}
