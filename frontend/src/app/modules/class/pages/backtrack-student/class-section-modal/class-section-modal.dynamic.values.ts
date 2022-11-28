import { ClassSectionSession } from "../backtrack-student.models";
import { ClassSectionModalComponent } from "./class-section-modal.component";

export class ClassSectionModalDynamicValues {

    vm: ClassSectionModalComponent;

    constructor() {}

    initialize(vm: ClassSectionModalComponent) { this.vm = vm; }

    isClassSectionSessionEnabled(classSectionSession: ClassSectionSession) {

        return this.vm.studentSectionListOfAllSessionsForAllStudentsOfCurrentSession.find(studentSectionObject => {
            return studentSectionObject.parentStudent == this.vm.student.id &&
                studentSectionObject.parentSession == classSectionSession.session.id;
        }) == undefined;

    }

}