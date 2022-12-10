import { GenerateHallTicketComponent } from './generate-hall-ticket.component';

export class GenerateHallTicketServiceAdapter {
    vm: GenerateHallTicketComponent;

    constructor() {}

    // Data
    examinationList: any;
    classList: any;
    sectionList: any;
    subjectList: any;
    studentSectionList: any;
    studentSubjectList: any;
    testList: any;

    initializeAdapter(vm: GenerateHallTicketComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        let request_examination_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_student_section_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_student_subject_data = {
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
            schoolId: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
            this.vm.studentService.getStudentMiniProfileList(request_student_section_data, this.vm.user.jwt),
            this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt),
            this.vm.schoolService.getObjectList(this.vm.schoolService.board, {}),
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}),
        ]).then(
            (value) => {
                let request_test_data = {
                    parentExamination__in: value[0].map((a) => a.id),
                };

                this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_test_data).then((value2) => {
                    this.examinationList = value[0];
                    this.classList = value[1];
                    this.sectionList = value[2];
                    this.subjectList = value[3];
                    this.studentSectionList = value[4];
                    this.studentSubjectList = value[5];
                    this.vm.boardList = value[6];
                    this.vm.sessionList = value[7];
                    this.testList = value2;

                    this.populateExaminationList();

                    this.vm.isLoading = false;
                });
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateExaminationList(): void {
        this.vm.examinationList = [];

        this.examinationList.forEach((examination) => {
            let tempExamination = {};
            Object.keys(examination).forEach((key) => {
                tempExamination[key] = examination[key];
            });
            tempExamination['classList'] = [];
            this.classList.forEach((classs) => {
                let tempClass = {};
                Object.keys(classs).forEach((key) => {
                    tempClass[key] = classs[key];
                });
                tempClass['sectionList'] = [];
                this.sectionList.forEach((section) => {
                    let tempSection = {};
                    Object.keys(section).forEach((key) => {
                        tempSection[key] = section[key];
                    });
                    tempSection['studentList'] = [];
                    this.studentSectionList.forEach((student) => {
                        if (
                            student.classDbId === classs.id &&
                            student.sectionDbId === section.id &&
                            student.parentTransferCertificate == null
                        ) {
                            let tempStudent = {};
                            Object.keys(student).forEach((key) => {
                                tempStudent[key] = student[key];
                            });
                            tempStudent['selected'] = true;
                            tempStudent['subjectList'] = [];
                            this.studentSubjectList.forEach((studentSubject) => {
                                if (studentSubject.parentStudent === student.dbId) {
                                    let tempSubject = {};
                                    Object.keys(studentSubject).forEach((key) => {
                                        tempSubject[key] = studentSubject[key];
                                    });
                                    tempStudent['subjectList'].push(tempSubject);
                                }
                            });
                            tempStudent['testList'] = [];
                            this.testList.forEach((test) => {
                                if (
                                    test.parentExamination === examination.id &&
                                    test.parentClass === classs.id &&
                                    test.parentDivision === section.id
                                ) {
                                    tempStudent['subjectList'].every((studentSubject) => {
                                        if (test.parentSubject === studentSubject.parentSubject) {
                                            let timeAlreadyExist = false;

                                            tempStudent['testList'].every((item) => {
                                                if (item.startTime === test.startTime && item.endTime === test.endTime) {
                                                    item.subjectName += ' + ' + this.getTestName(test);
                                                    timeAlreadyExist = true;
                                                    return false;
                                                }
                                                return true;
                                            });

                                            if (!timeAlreadyExist) {
                                                let tempTest = {};
                                                Object.keys(test).forEach((key) => {
                                                    tempTest[key] = test[key];
                                                });
                                                tempTest['subjectName'] = this.getTestName(test);
                                                tempStudent['testList'].push(tempTest);
                                            }

                                            return false;
                                        }
                                        return true;
                                    });
                                }
                            });
                            tempStudent['testList'].sort((a, b) => {
                                return +new Date(a.startTime) - +new Date(b.startTime);
                            });

                            tempSection['studentList'].push(tempStudent);
                        }
                    });
                    if (tempSection['studentList'].length > 0) {
                        tempClass['sectionList'].push(tempSection);
                    }
                });
                if (tempClass['sectionList'].length > 0) {
                    tempClass['selectedSection'] = tempClass['sectionList'][0];
                    tempExamination['classList'].push(tempClass);
                }
            });
            if (tempExamination['classList'].length > 0) {
                tempExamination['selectedClass'] = tempExamination['classList'][0];
                this.vm.examinationList.push(tempExamination);
            }
        });
        if (this.vm.examinationList.length > 0) {
            this.vm.selectedExamination = this.vm.examinationList[0];
        }

        console.log(this.vm.examinationList);
    }

    getTestName(test: any): any {
        let result = '';
        this.subjectList.every((subject) => {
            if (subject.id === test.parentSubject) {
                result = subject.name;
                return false;
            }
            return true;
        });
        if (test.testType != null) {
            result += '(' + test.testType + ')';
        }
        return result;
    }
}
