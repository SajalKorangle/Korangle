import { StudentPermissionComponent } from './student-permission.component';

export class StudentPermissionHtmlRenderer {

    vm: StudentPermissionComponent;

    classDivisionList: Array<any>;

    studentSectionList: Array<any>;

    constructor() { }

    initialize(vm: StudentPermissionComponent): void {
        this.vm = vm;
    }

    selectAllClasses(): void {
        this.classDivisionList.forEach(cd => cd.selected = true);
    }

    unselectAllClasses(): void {
        this.classDivisionList.forEach(cd => cd.selected = false);
    }

    selectAllStudent(): void {
        this.getFilteredStudentSectionList().forEach(ss => ss.selected = true);
    }

    blockAllStudent(): void {
        this.getFilteredStudentSectionList().forEach(ss => ss.selected = false);
    }

    getFilteredStudentSectionList(): Array<any> {
        return this.studentSectionList.filter(ss => {
            return this.classDivisionList.find(cd => cd.selected && cd.class.id == ss.parentClass && cd.section.id == ss.parentDivision);
        }).sort((ss1, ss2) => ss1.parentStudent.name.localeCompare(ss2.parentStudent.name));
    }

    deletecAnyChange(): boolean {
        const allRestrictedStudentList = this.vm.htmlRenderer.studentSectionList.filter(ss => !ss.selected).map(ss => {
            return { parentStudent: ss.parentStudent.id };
        });
        if (allRestrictedStudentList.length != this.vm.backendData.restrictedStudentList.length) {
            return true;
        }
        const currentAndSavedRestrictedStudentdDiff = allRestrictedStudentList.filter(restrictedStudent1 => {
            return !this.vm.backendData.restrictedStudentList.find(restrictedStudent2 => restrictedStudent1.parentStudent == restrictedStudent2.parentStudent);
        });
        if (currentAndSavedRestrictedStudentdDiff.length == 0)
            return false;
        return true;

    }

}
