
import {GenerateHallTicketComponent} from './generate-hall-ticket.component';

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
            'schoolId': this.vm.user.activeSchool.dbId,
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_student_section_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_student_subject_data = {
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
            schoolId: this.vm.user.activeSchool.dbId,
        };

        let request_test_data = {
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
            schoolId: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.examinationService.getExaminationList(request_examination_data, this.vm.user.jwt),
            this.vm.classService.getClassList(this.vm.user.jwt),
            this.vm.classService.getSectionList(this.vm.user.jwt),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
            this.vm.studentService.getStudentMiniProfileList(request_student_section_data, this.vm.user.jwt),
            this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt),
            this.vm.examinationService.getTestList(request_test_data, this.vm.user.jwt),
        ]).then(value => {

            this.examinationList = value[0];
            this.classList = value[1];
            this.sectionList = value[2];
            this.subjectList = value[3];
            this.studentSectionList = value[4];
            this.studentSubjectList = value[5];
            this.testList = value[6];

            this.populateExaminationList();

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    populateExaminationList(): void {

        this.vm.examinationList = [];

        this.examinationList.forEach(examination => {
            let tempExamination = {};
            Object.keys(examination).forEach(key => {
                tempExamination[key] = examination[key];
            });
            tempExamination['classList'] = [];
            this.classList.forEach(classs => {
                let tempClass = {};
                Object.keys(classs).forEach(key => {
                    tempClass[key] = classs[key];
                });
                tempClass['sectionList'] = [];
                this.sectionList.forEach(section => {
                    let tempSection = {};
                    Object.keys(section).forEach(key => {
                        tempSection[key] = section[key];
                    });
                    tempSection['studentList'] = [];
                    this.studentSectionList.forEach(student => {
                        if (student.classDbId === classs.dbId
                            && student.sectionDbId === section.id
                            && student.parentTransferCertificate == null) {
                            let tempStudent = {};
                            Object.keys(student).forEach(key => {
                                tempStudent[key] = student[key];
                            });
                            tempStudent['subjectList'] = [];
                            this.studentSubjectList.forEach(studentSubject => {
                                if (studentSubject.parentStudent === student.dbId) {
                                    let tempSubject = {};
                                    Object.keys(studentSubject).forEach(key => {
                                        tempSubject[key] = studentSubject[key];
                                    });
                                    tempStudent['subjectList'].push(tempSubject);
                                }
                            });
                            tempStudent['testList'] = [];
                            this.testList.forEach(test => {
                                if (test.parentExamination === examination.id
                                    && test.parentClass === classs.dbId
                                    && test.parentDivision === section.id) {
                                    tempStudent['subjectList'].every(studentSubject => {
                                        if (test.parentSubject === studentSubject.parentSubject) {

                                            let timeAlreadyExist = false;

                                            tempStudent['testList'].every(item => {
                                                if (item.startTime === test.startTime
                                                    && item.endTime === test.endTime) {
                                                    item.subjectName += ' + ' + this.getTestName(test);
                                                    timeAlreadyExist = true;
                                                    return false;
                                                }
                                                return true;
                                            });

                                            if (!timeAlreadyExist) {
                                                let tempTest = {};
                                                Object.keys(test).forEach(key => {
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
                            tempStudent['testList'].sort((a,b) => {
                                return +new Date(a.startTime) - +new Date(b.startTime);
                            });

                            tempSection['studentList'].push(tempStudent);
                        }
                    });
                    tempClass['sectionList'].push(tempSection);
                });
                tempClass['selectedSection'] = tempClass['sectionList'][0];
                tempExamination['classList'].push(tempClass);
            });
            tempExamination['selectedClass'] = tempExamination['classList'][0];
            this.vm.examinationList.push(tempExamination);
        });
        this.vm.selectedExamination = this.vm.examinationList[0];

        console.log(this.vm.examinationList);

    }

    getTestName(test: any): any {
        let result = '';
        this.subjectList.every(subject => {
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