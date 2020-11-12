
import {AddStudentRemarksComponent} from './add-student-remarks.component';

export class AddStudentRemarksHtmlAdapter {

    vm: AddStudentRemarksComponent;

    selectedClassSection: any;

    constructor() {}

    initializeAdapter(vm: AddStudentRemarksComponent): void {
        this.vm = vm;
    }

}
