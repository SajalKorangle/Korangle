import {BlockStudentComponent} from './block-student.component';

export class BlockStudentUserInput {

    vm: BlockStudentComponent;

    constructor() { }

    initialize(vm: BlockStudentComponent): void {
        this.vm = vm;
    }

}