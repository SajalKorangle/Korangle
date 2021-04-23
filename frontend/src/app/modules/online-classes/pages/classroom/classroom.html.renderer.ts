import {ClassroomComponent} from './classroom.component';

export class ClassroomHtmlRenderer {

    vm: ClassroomComponent;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

}
