import {StudentPermissionComponent} from './student-permission.component';

export class StudentPermissionServiceAdapter {

    vm: StudentPermissionComponent;

    constructor() { }

    initialize(vm: StudentPermissionComponent): void {
        this.vm = vm;
    }

}
