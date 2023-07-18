import { ClassSectionSession } from "../backtrack-student.models";
import { ClassSectionModalComponent } from "./class-section-modal.component";

export class ClassSectionModalDynamicValues {

    vm: ClassSectionModalComponent;

    constructor() {}

    initialize(vm: ClassSectionModalComponent) { this.vm = vm; }

    isClassSectionSessionEnabled(classSectionSession: ClassSectionSession) {

        return classSectionSession.session.orderNumber < this.vm.student.allowedAdmissionSessionList[0].orderNumber;

    }

}