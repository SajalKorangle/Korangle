import { RemoveDuplicateMarksComponent } from './remove-duplicate-marks.component';

export class RemoveDuplicateMarksHtmlAdapter {
    vm: RemoveDuplicateMarksComponent;

    constructor() {}

    initialize(vm: RemoveDuplicateMarksComponent): void {
        this.vm = vm;
    }

    getName(id: any, list: any): any {
        return list.find(item => item.id == id).name;
    }

    getMaximumMarks(examination: any, studentTest: any): any {
        let test = examination.testsecond.find(test => {
            return test.parentSubject == studentTest.parentSubject &&
                test.parentClass == studentTest.parentStudentInstance.studentSectionList[0].parentClass &&
                test.parentDivision == studentTest.parentStudentInstance.studentSectionList[0].parentDivision;
        });
        if (test) { return Number(test.maximumMarks.toString()); }
        else { return null; }
    }

    buttonClicked(result: any, studentTest: any) {
        result.selected = !result.selected;
        studentTest.marksList.forEach(resultOne => {
            if (result.id != resultOne.id) {
                resultOne.selected = false;
            }
        });
    }

}
