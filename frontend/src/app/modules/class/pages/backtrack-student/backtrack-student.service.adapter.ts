import { StudentSection } from "@services/modules/student/models/student-section";
import { BacktrackStudentComponent } from "./backtrack-student.component";
import { Student, Session, ClassSectionSession } from "./backtrack-student.models";

export class BacktrackStudentServiceAdapter {

    vm: BacktrackStudentComponent;

    studentSectionList: {
        parentStudent: number,
        parentClass: number,
        parentDivision: number,
        parentSession: number
    } [] = [];

    constructor() {}

    initializeAdapter(vm: BacktrackStudentComponent): void {
        this.vm = vm;
    }


    async initializeData() {
        this.vm.isLoading = true;
        let value = await Promise.all([
            this.vm.genericService.getObjectList({ class_app: 'Class' }, {}),  //           0 - get all the classes
            this.vm.genericService.getObjectList({ class_app: 'Division' }, {}),  //        1 - get all the sections
            this.vm.genericService.getObjectList({ school_app: 'Session'}, {}), //          2 - get all sessions
            // get all student's class and section in the currently active school
            this.vm.genericService.getObjectList({ student_app: 'StudentSection' }, {  //   3
                filter: {
                    parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                    parentSession: this.vm.user.activeSchool.currentSessionDbId
                },
                fields_list: ['parentStudent', 'parentClass', 'parentDivision', 'parentSession']
            })
        ]);

        this.vm.classList = value[0];
        this.vm.sectionList = value[1];
        this.vm.sessionList = value[2];
        this.studentSectionList = value[3];

        await Promise.all([
            this.getStudentSectionListOfAllSessionsForAllStudentsOfCurrentSession(),
            this.populateClassSectionList(),
        ]);

        this.vm.isLoading = false;
    }

    // START :- Populate class section list variable for dropdown
    async populateClassSectionList() {

        this.vm.classSectionList = [];

        // START :- Populate the class section list
        this.studentSectionList.forEach((studentSection) => {
            if (
                this.vm.classSectionList.find(classSection => {
                    return classSection.class.id == studentSection.parentClass &&
                        classSection.section.id == studentSection.parentDivision;
                }) == undefined
            ) {
                this.vm.classSectionList.push({
                    class: this.vm.classList.find((classObj) => classObj.id == studentSection.parentClass),
                    section: this.vm.sectionList.find((sectionObj) => sectionObj.id == studentSection.parentDivision)
                });
            }
        });
        // End :- Populate the class section list

        // START :- Sort class section list by Class 12, 11, 10... and then Section A,B,C...
        this.vm.classSectionList.sort((a, b) => {
            if (a.class.id > b.class.id) {
                return 1;
            } else if (a.class.id < b.class.id) {
                return -1;
            } else {
                if (a.section.id > b.section.id) {
                    return 1;
                } else if (a.section.id < b.section.id) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });
        // End :- Sort class section list by Class 12, 11, 10... and then Section A,B,C...

    }
    // End :- Populate class section list variable for dropdown

    async getStudentSectionListOfAllSessionsForAllStudentsOfCurrentSession() {

        // Start: Fetch data from backend
        const studentSectionListOfAllSessionsForAllStudentsOfCurrentSession
        = await this.vm.genericService.getObjectList({ student_app: 'StudentSection' }, {
            filter: {
                parentStudent__in: this.studentSectionList.map(studentSection => studentSection.parentStudent)
            },
            order_by: [
                '-parentSession__orderNumber'
            ],
            fields_list: ['parentStudent', 'parentStudent__admissionSession', 'parentStudent__dateOfAdmission', 'parentStudent__name', 'parentClass', 'parentDivision', 'parentSession']
        });
        // End: Fetch data from backend

        // START :- Populate Student List
        studentSectionListOfAllSessionsForAllStudentsOfCurrentSession.forEach(studentSection => {

            // Start :- Getting the student if it already exists in the list
            let student = this.vm.studentList.find(student => {
                return student.id == studentSection.parentStudent;
            });
            // End :- Getting the student if it already exists in the list

            if (student == undefined) { // Add student to student list
                student = {
                    id: studentSection.parentStudent,
                    name: studentSection.parentStudent__name,
                    admissionSession: studentSection.parentStudent__admissionSession,
                    dateOfAdmission: studentSection.parentStudent__dateOfAdmission,
                    allowedAdmissionSessionList: [],
                    classSectionSessionList: [{
                        class: this.vm.classList.find((classObj) => classObj.id == studentSection.parentClass),
                        section: this.vm.sectionList.find((sectionObj) => sectionObj.id == studentSection.parentDivision),
                        session: this.vm.sessionList.find((sessionObj) => sessionObj.id == studentSection.parentSession)
                    }],
                    currentClassSectionSession: null,
                    potentialAdmissionSession: null
                };
                this.vm.studentList.push(student);
            } else { // Add new class section session entry in the student
                student.classSectionSessionList.push({
                    class: this.vm.classList.find((classObj) => classObj.id == studentSection.parentClass),
                    section: this.vm.sectionList.find((sectionObj) => sectionObj.id == studentSection.parentDivision),
                    session: this.vm.sessionList.find((sessionObj) => sessionObj.id == studentSection.parentSession)
                });
            }

            // Start :- Populating currentClassSectionSession if this for current Session
            if (studentSection.parentSession == this.vm.user.activeSchool.currentSessionDbId) {
                student.currentClassSectionSession = {
                    class: this.vm.classList.find((classObj) => classObj.id == studentSection.parentClass),
                    section: this.vm.sectionList.find((sectionObj) => sectionObj.id == studentSection.parentDivision),
                    session: this.vm.sessionList.find((sessionObj) => sessionObj.id == studentSection.parentSession)
                };
            }
            // End :- Populating currentClassSectionSession if this for current Session

        });
        // End :- Populate Student List

        // Start :- Populating AllowedAdmissionSessionList
        this.vm.studentList.forEach((student: Student) => {
            let studentSectionListOfAllSessionsForSelectedStudent =
                studentSectionListOfAllSessionsForAllStudentsOfCurrentSession.filter(studentSection => {
                return studentSection.parentStudent == student.id;
            });
            let oldestCurrentBackendSession = this.vm.sessionList.find(sessionObj => {
                return sessionObj.id ==
                    studentSectionListOfAllSessionsForSelectedStudent[studentSectionListOfAllSessionsForSelectedStudent.length - 1].parentSession;
            });
            student.allowedAdmissionSessionList = this.vm.sessionList.slice().reverse().filter(session => {
              return session.orderNumber <= oldestCurrentBackendSession.orderNumber;
            });
        });
        // End :- Populating AllowedAdmissionSessionList

        // Start :- Populating Potential Admission Session
        this.vm.studentList.forEach((student: Student) => {
            // Will populate potential admission session only when date of admission field is populated.
            if (student.dateOfAdmission) {

                // If date of admission is of before first session, then at least backtrack till first session.
                if (student.dateOfAdmission < this.vm.sessionList[0].startDate) {
                    student.potentialAdmissionSession = this.vm.sessionList[0];
                // if date of admission is at or after first session,
                // then see the allowed admission session list to find appropriate potential admission session.
                } else {
                    // Iterating over the list of allowed admission session
                    // If date of admission is not before first session and is not in allowed admission session list then
                    // chances are that there is something wrong with date of admission.
                    const potentialAdmissionSession = student.allowedAdmissionSessionList.find((session: Session) => {
                        return student.dateOfAdmission >= session.startDate && student.dateOfAdmission <= session.endDate;
                    });
                    if (potentialAdmissionSession != undefined) {
                        student.potentialAdmissionSession = potentialAdmissionSession;
                    }
                }

            }
        });
        // End :- Populating Potential Admission Session

    }

    async backtrackStudents() {

        this.vm.isLoading = true;

        // Start:- Prepare student section list to add
        let studentSectionListToAdd = [];
        this.vm.studentList.forEach((student: Student) => {

            let numberOfNewSessions = 0;

            student.classSectionSessionList.forEach((classSectionSession: ClassSectionSession) => {
                if (classSectionSession.session.orderNumber < student.allowedAdmissionSessionList[0].orderNumber) {
                    studentSectionListToAdd.push({
                        parentStudent: student.id,
                        parentClass: classSectionSession.class.id,
                        parentDivision: classSectionSession.section.id,
                        parentSession: classSectionSession.session.id
                    });
                    ++numberOfNewSessions;
                }
            });

            if (numberOfNewSessions > 0) {

                // Start : Removing first session from allowed admission session list of student
                student.allowedAdmissionSessionList.splice(0, numberOfNewSessions);
                // End : Removing first session from allowed admission session list of student

                // Start : Nullify Potential Admission Session if it is already populated in backend.
                if (student.potentialAdmissionSession &&
                    student.allowedAdmissionSessionList[0].orderNumber < student.potentialAdmissionSession.orderNumber) {
                    student.potentialAdmissionSession = null;
                }
                // End : Nullify Potential Admission Session if it is already populated in backend.

            }
        });
        // End :- Prepare student section list to add

        // Start : Make api calls to add student section list
        await this.vm.genericService.createObjectList({student_app: 'StudentSection'}, studentSectionListToAdd);
        // End : Make api calls to add student section list

        alert("Student/s backtracked successfully!");

        this.vm.isLoading = false;

    }

}