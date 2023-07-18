import { BacktrackStudentComponent } from "./backtrack-student.component";
import { MatDialog } from '@angular/material';
import { ClassSectionSession, Session, Student } from "./backtrack-student.models";
import { ClassSectionModalComponent } from "./class-section-modal/class-section-modal.component";

export class BacktrackStudentHtmlAdapter {

    vm: BacktrackStudentComponent;

    selectedClassSection: {
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
    } = null;

    bottomMarginStyle;

    constructor(public dialog: MatDialog) {}

    initialize(vm: BacktrackStudentComponent) {
        this.vm = vm;
        this.bottomMarginStyle = {
            'margin-bottom': this.vm.isMobileMenu() ? '90px' : '60px',
        };
    }

    // START: Map Admission Session to potential admission session
    mapAdmissionSession() {
        // Iterating over the list of filtered students
        this.vm.htmlAdapter.getFilteredStudentList().forEach((student: Student) => {
            // Will map admission session only when potential admission is populated.
            if (student.potentialAdmissionSession) {
                this.handleAdmissionSessionChange(student.potentialAdmissionSession, student);
            }
        });

    }
    // End: Map Admission Session to potential admission session

    // Start: reset admission session to original backend value
    resetAdmissionSession() {
        // Iterating over the list of filtered students
        this.vm.htmlAdapter.getFilteredStudentList().forEach((student: Student) => {
            this.handleAdmissionSessionChange(student.allowedAdmissionSessionList[0], student);
        });
    }
    // End: reset admission session to original backend value

    // Start: Update class section session list of student on admission session change
    handleAdmissionSessionChange(selectedAdmissionSession: Session, student: Student) {

        // Start: Delete if any older session than selected Admission Session
        student.classSectionSessionList = student.classSectionSessionList.filter(classSectionSessionObj => {
            return classSectionSessionObj.session.orderNumber >= selectedAdmissionSession.orderNumber;
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
                && session.orderNumber >= selectedAdmissionSession.orderNumber) {
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
        if (this.selectedClassSection) {
            return this.vm.studentList.filter((student) => {
                return this.selectedClassSection.class.id == student.currentClassSectionSession.class.id
                    && this.selectedClassSection.section.id == student.currentClassSectionSession.section.id;
            });
        }
        return [];
    }
    // End: Get list of student list based on class section filters

    // Start: Highlight Student Row if student's data is updated
    highlightStudentRow(student: Student): boolean {

        // Start :- Check if class section session exists for more than one allowed admission session values
        return student.classSectionSessionList.find((classSectionSession: ClassSectionSession) => {
            return classSectionSession.session.orderNumber < student.allowedAdmissionSessionList[0].orderNumber;
        }) != undefined;
        // End :- Check if class section session exists for more than one allowed admission session values

    }
    // End: Highlight Student Row if student's data is updated

    // Start: Open Class Section Modal for more customization
    openClassSectionModal(student: Student) {
        this.dialog.open(ClassSectionModalComponent, {
            data: {
                user: this.vm.user,
                student: student,
                classList: this.vm.classList,
                sectionList: this.vm.sectionList,
                sessionList: this.vm.sessionList
            }
        });
    }
    // End: Open Class Section Modal for more customization

    // Start: get admission session of student
    getAdmissionSession(student: Student): Session {
        return student.classSectionSessionList[student.classSectionSessionList.length - 1].session;
    }
    // End: get admission session of student

    // Start: disable update button if no data to update
    disableButton(): boolean {
        return this.getFilteredStudentList().find((student: Student) => {
            return this.highlightStudentRow(student);
        }) == undefined;
    }
    // Start: disable update button if no data to update

}