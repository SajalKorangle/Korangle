import {ClassroomComponent} from './classroom.component';

export class ClassroomBackendData {

    vm: ClassroomComponent;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

}
