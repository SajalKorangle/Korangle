import { UnpromoteStudentComponent } from './unpromote-student.component';

export class UnpromoteStudentHtmlRenderer {
    vm: UnpromoteStudentComponent;

    constructor() {}

    initializeRenderer(vm: UnpromoteStudentComponent): void {
        this.vm = vm;
    }
}