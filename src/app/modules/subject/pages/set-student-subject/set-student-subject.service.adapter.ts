
import {SetStudentSubjectComponent} from './set-student-subject.component';

export class SetStudentSubjectServiceAdapter {

    vm: SetStudentSubjectComponent;

    constructor() {}

    // Data
    subjectList: any;
    classSubjectList: any;
    studentSubjectList: any;


    initializeAdapter(vm: SetStudentSubjectComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {

        this.vm.subjectService.getSubjectList(this.vm.user.jwt).then(value => {
            this.subjectList = value;
        });

    }

    // Get Student & Class Subjects
    getStudentSubjects(student: any): void {

        this.vm.selectedStudent = student;
        if (student === null) {
            return;
        }

        this.vm.isLoading = true;

        const request_student_subject_data = {
            studentId: student.dbId,
            sessionId: this.vm.selectedSession.dbId,
        };

        const request_class_subject_data = {
            classId: student.classDbId,
            sectionId: student.sectionDbId,
            schoolId: this.vm.user.activeSchool.dbId,
            sessionId: this.vm.selectedSession.dbId,
        };

        Promise.all([
            this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt),
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
        ]).then(value => {
            this.studentSubjectList = value[0];
            this.classSubjectList = value[1];
            this.populateStudentClassAllSubjectList(value[1], value[0]);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    populateStudentClassAllSubjectList(classSubjectList, studentSubjectList): void {
        this.vm.studentClassAllSubjectList = [];
        classSubjectList.forEach(classSubject => {
            let tempData = {
                'studentSubjectId': null,
                'classSubjectId': classSubject.id,
                'subjectName': this.getSubjectName(classSubject.parentSubject),
                'subjectId': classSubject.parentSubject,
                'updating': false,
            };
            this.vm.studentClassAllSubjectList.push(tempData);
        });
        studentSubjectList.forEach(studentSubject => {
            let alreadyAdded = false;
            this.vm.studentClassAllSubjectList.every(item => {
                if (item.subjectId === studentSubject.parentSubject) {
                    item.studentSubjectId = studentSubject.id;
                    alreadyAdded = true;
                    return false;
                }
                return true;
            });
            if (!alreadyAdded) {
                let tempData = {
                    'studentSubjectId': studentSubject.id,
                    'classSubjectId': null,
                    'subjectName': this.getSubjectName(studentSubject.parentSubject),
                    'subjectId': studentSubject.parentSubject,
                    'updating': false,
                };
                this.vm.studentClassAllSubjectList.push(tempData);
            }
        });
    }

    getSubjectName(subjectId: any): any {
        let result = '';
        this.subjectList.every(subject => {
            if (subject.id === subjectId) {
                result = subject.name;
                return false;
            }
            return true;
        });
        return result;
    }

    // Add or remove Student Subject
    updateStudentSubject(item: any): void {
        item.updating = true;

        if (item.studentSubjectId === null) {

            let data = {
                parentStudent: this.vm.selectedStudent.dbId,
                parentSession: this.vm.selectedSession.dbId,
                parentSubject: item.subjectId,
            };

            this.vm.subjectService.createStudentSubject(data, this.vm.user.jwt).then(value => {
                item.studentSubjectId = value.id;
                item.updating = false;
            });

        } else {

            let data = item.studentSubjectId;

            this.vm.subjectService.deleteStudentSubject(data, this.vm.user.jwt).then(value => {
                item.studentSubjectId = null;

                if (item.classSubjectId === null) {
                    this.vm.studentClassAllSubjectList = this.vm.studentClassAllSubjectList.filter( itemTwo => {
                        if (itemTwo.subjectId === item.subjectId) {
                            return false;
                        }
                        return true;
                    });
                }

                item.updating = false;
            });

        }

    }

}