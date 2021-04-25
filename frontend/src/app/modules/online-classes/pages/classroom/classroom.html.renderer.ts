import { ClassroomComponent } from './classroom.component';

export class ClassroomHtmlRenderer {

    vm: ClassroomComponent;

    mettingEntered: boolean = false;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

}
