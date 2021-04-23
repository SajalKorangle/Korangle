import {ClassroomComponent} from './classroom.component';

export class ClassroomServiceAdapter {

    vm: ClassroomComponent;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

}
