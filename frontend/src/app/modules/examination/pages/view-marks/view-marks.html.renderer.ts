import { ViewMarksComponent } from './view-marks.component';

export class ViewMarksHtmlRenderer {
    vm: ViewMarksComponent;

    constructor() {}

    initialize(vm: ViewMarksComponent): void {
        this.vm = vm;
    }

    getStudentAbsentStatus(studentSection: any, test: any): any {
        let studentTest = this.vm.studentTestList.find((item) => {
            return studentSection.parentStudent == item.parentStudent && test.parentSubject == item.parentSubject && test.testType == item.testType;
        });
        if (studentTest) {
            return studentTest.absent;
        } else {
            return false;
        }
    }
}
