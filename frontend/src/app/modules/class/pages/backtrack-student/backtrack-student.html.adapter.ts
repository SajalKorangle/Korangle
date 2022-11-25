import { BacktrackStudentComponent } from "./backtrack-student.component";
import { Student } from "./backtrack-student.models";

export class BacktrackStudentHtmlAdapter {

    vm: BacktrackStudentComponent;

    selectedClassSectionList: {
        class: {
            id: number,
            name: string,
            orderNumber: number
        },
        section: {
            id: number,
            name: string,
            orderNumber: number
        }
    }[] = [];

    constructor() {}

    initialize(vm: BacktrackStudentComponent) { this.vm = vm; }

    // START: select all the class-sections
    selectAllClassSectionHandler() {
        this.selectedClassSectionList = [];
        this.selectedClassSectionList = this.vm.classSectionList;
    }
    // END: select all the class-sections

    // START: deselect all the class-sections
    clearAllClassSectionHandler() {
        this.selectedClassSectionList = [];
    }
    // END: deselect all the class-sections

    // Start: Update class section session list of student on admission session change
    handleAdmissionSessionChange(student: Student) {

        // Start: Delete if any older session than selected Admission Session
        student.classSectionSessionList = student.classSectionSessionList.filter(classSectionSessionObj => {
            return classSectionSessionObj.session.orderNumber >= student.selectedAdmissionSession.orderNumber;
        });
        // End: Delete if any older session than selected Admission Session

        // Start: Calculate oldest class and section of student
        let oldestClassSectionSession = student.classSectionSessionList[student.classSectionSessionList.length - 1];
        let oldestClassIndex = this.vm.classList.findIndex(classs => classs.id == oldestClassSectionSession.class.id);
        let oldestSectionIndex = this.vm.sectionList.findIndex(section => section.id == oldestClassSectionSession.section.id);
        // End: Calculate oldest class and section of student

        // Start: Add older sessions till selected Admission Session
        this.vm.sessionList.slice().reverse().forEach(session => {
            if (session.orderNumber < oldestClassSectionSession.session.orderNumber
                && session.orderNumber >= student.selectedAdmissionSession.orderNumber) {
                student.classSectionSessionList.push({
                    session: session,
                    class: this.vm.classList[oldestClassIndex < this.vm.classList.length - 1 ? ++oldestClassIndex : oldestClassIndex],
                    section: this.vm.sectionList[oldestSectionIndex],
                });
            }
        });
        // End: Add older sessions till selected Admission Session

    }
    // End: Update class section session list of student on admission session change

    // Start: Get list of student list based on class section filters
    getFilteredStudentList(): Student[] {
        return this.vm.studentList.filter((student) => {
            let studentCurrentSessionData = student.classSectionSessionList.find(classSectionSessionObj => {
                return classSectionSessionObj.session.id == this.vm.user.activeSchool.currentSessionDbId;
            });
            return this.selectedClassSectionList.find(selectedClassSection => {
                return selectedClassSection.class.id == studentCurrentSessionData.class.id
                    && selectedClassSection.section.id == studentCurrentSessionData.section.id;
            }) != undefined;
        });
    }
    // End: Get list of student list based on class section filters

    // Start: Highlight Student Row if student's data is updated
    highlightStudentRow(student: Student): boolean {

        // Start :- Filter list only for student
        let filteredList = this.vm.studentSectionListOfAllSessionsForAllStudentsOfCurrentSession.filter(studentSectionObj => {
            return studentSectionObj.parentStudent == student.id;
        });
        // End :- Filter list only for student

        // Start :- Check if there are more sessions in student then in backend.
        if (student.classSectionSessionList.length != filteredList.length) {
            return true;
        }
        // End :- Check if there are more sessions in student then in backend.

        return false;

    }
    // End: Highlight Student Row if student's data is updated

}