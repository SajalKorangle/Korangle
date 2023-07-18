import { DeleteStudentComponent } from './delete-student.component';

export class DeleteStudentBackendData {

    tcList: any;

    vm: DeleteStudentComponent;

    constructor() { }

    initialize(vm: DeleteStudentComponent): void {
        this.vm = vm;
    }

}
