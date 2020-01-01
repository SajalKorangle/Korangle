
import {SetStudentSubjectComponent} from './set-student-subject.component';

export class SetStudentSubjectServiceAdapter {

    vm: SetStudentSubjectComponent;

    constructor() {}

    // Data
    subjectList: any;
    examinationList: any;

    classSubjectList: any;
    studentSubjectList: any;
    classTestList: any;
    studentTestList: any;


    initializeAdapter(vm: SetStudentSubjectComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {


        let request_examination_data = {
            'schoolId': this.vm.user.activeSchool.dbId,
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
            this.vm.examinationOldService.getExaminationList(request_examination_data, this.vm.user.jwt),
        ]).then(value => {
            this.subjectList = value[0];
            this.examinationList = value[1];
        });

    }

    // Get Student & Class Subjects & Tests
    getStudentAndClassSubjectsAndTests(student: any): void {

        this.vm.selectedStudent = student;
        if (student === null) {
            return;
        }

        this.vm.isLoading = true;

        this.studentSubjectList = [];
        this.classSubjectList = [];
        this.studentTestList = [];
        this.classTestList = [];

        const request_student_subject_data = {
            studentId: student.dbId,
            sessionId: this.vm.selectedSession.dbId,
        };

        const request_class_subject_data = {
            /*classId: student.classDbId,
            sectionId: student.sectionDbId,
            schoolId: this.vm.user.activeSchool.dbId,
            sessionId: this.vm.selectedSession.dbId,*/
            'classList': [student.classDbId],
            'sectionList': [student.sectionDbId],
            'schoolList': [this.vm.user.activeSchool.dbId],
            'sessionList': [this.vm.selectedSession.dbId],
        };

        const request_student_test_data = {
            'studentList': [student.dbId],
            'subjectList': [],
            'examinationList': this.prepareExaminationList(),
            'testTypeList': [],
            'marksObtainedList': [],
        };

        let request_class_test_data = {
            'examinationList': this.prepareExaminationList(),
            'subjectList': [],
            'classList': [student.classDbId],
            'sectionList': [student.sectionDbId],
            'startTimeList': [],
            'endTimeList': [],
            'testTypeList': [],
            'maximumMarksList': [],
        };

        Promise.all([
            this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt),
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
            this.vm.examinationOldService.getStudentTestList(request_student_test_data, this.vm.user.jwt),
            this.vm.examinationOldService.getTestList(request_class_test_data, this.vm.user.jwt),
        ]).then(value => {
            this.studentSubjectList = value[0];
            this.classSubjectList = value[1];
            this.studentTestList = value[2];
            this.classTestList = value[3];
            this.populateStudentClassAllSubjectList(value[1], value[0]);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    prepareExaminationList(): any {
        let id_list = [];
        this.examinationList.forEach(item => {
            id_list.push(item.id);
        });
        if (id_list.length === 0) {
            id_list.push(0);
        }
        return id_list;
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

    // Update Student Subjects and Tests
    updateStudentSubjectAndTests(item: any): void {
        item.updating = true;

        if (item.studentSubjectId === null) {
            this.addStudentSubjectAndTests(item);
        } else {
            this.removeStudentSubjectAndTests(item);
        }

    }

    addStudentSubjectAndTests(item: any): void {

        let student_subject_data = {
            parentStudent: this.vm.selectedStudent.dbId,
            parentSession: this.vm.selectedSession.dbId,
            parentSubject: item.subjectId,
        };

        let student_test_data = this.prepareStudentTestDataToAdd(item.subjectId);

        Promise.all([
            this.vm.subjectService.createStudentSubject(student_subject_data, this.vm.user.jwt),
            this.vm.examinationOldService.createStudentTestList(student_test_data, this.vm.user.jwt),
        ]).then(value => {
            item.studentSubjectId = value[0].id;
            value[1].forEach(itemTwo => {
                this.studentTestList.push(itemTwo);
            });
            item.updating = false;
        });

    }

    prepareStudentTestDataToAdd(subjectId: any): any {
        let data_list = [];
        this.classTestList.forEach(item => {
            if (item.parentSubject === subjectId) {
                let data = {
                    'parentExamination': item.parentExamination,
                    'parentSubject': item.parentSubject,
                    'parentStudent': this.vm.selectedStudent.dbId,
                    'testType': item.testType,
                    'marksObtained': 0,
                };
                data_list.push(data);
            }
        });
        return data_list
    }

    removeStudentSubjectAndTests(item: any): void {

        let subject_data = item.studentSubjectId;

        let student_test_data = this.prepareStudentTestDataToRemove(item.subjectId);

        let request_array = [];
        request_array.push(this.vm.subjectService.deleteStudentSubject(subject_data, this.vm.user.jwt));

        if (student_test_data.length > 0) {
            request_array.push(this.vm.examinationOldService.deleteStudentTestList(student_test_data.join(), this.vm.user.jwt))
        }

        Promise.all(request_array).then(value => {
            item.studentSubjectId = null;

            if (item.classSubjectId === null) {
                this.vm.studentClassAllSubjectList = this.vm.studentClassAllSubjectList.filter( itemTwo => {
                    if (itemTwo.subjectId === item.subjectId) {
                        return false;
                    }
                    return true;
                });
            }

            this.studentTestList = this.studentTestList.filter(itemTwo => {
                if (itemTwo.parentSubject === item.subjectId) {
                    return false;
                }
                return true;
            });

            item.updating = false;
        });

    }

    prepareStudentTestDataToRemove(subjectId: any): any {
        let id_list = [];
        this.studentTestList.forEach(item => {
            if (item.parentSubject === subjectId) {
                id_list.push(item.id);
            }
        });
        return id_list;
    }

}