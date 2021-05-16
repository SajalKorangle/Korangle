import {StudentPermissionComponent} from './student-permission.component';

export class StudentPermissionBackendData {

    vm: StudentPermissionComponent;

    constructor() { }

    initialize(vm: StudentPermissionComponent): void {
        this.vm = vm;
    }

}
