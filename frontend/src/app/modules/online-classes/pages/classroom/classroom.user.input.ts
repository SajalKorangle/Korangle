import {ClassroomComponent} from './classroom.component';

export class ClassroomUserInput {

    vm: ClassroomComponent;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

}
