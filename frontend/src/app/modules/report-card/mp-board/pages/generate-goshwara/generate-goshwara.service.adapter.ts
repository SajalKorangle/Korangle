import { GenerateGoshwaraComponent } from './generate-goshwara.component';

export class GenerateGoshwaraServiceAdapter {
    vm: GenerateGoshwaraComponent;

    constructor() {}

    // Data
    reportCardMapping: any;
    classList: any;
    // sectionList: any;
    studentList: any;
    examinationList: any;
    subjectList: any;
    extraFieldList: any;
    extraSubFieldList: any;

    classSubjectList: any;
    studentSubjectList: any;
    classTestList: any;
    studentTestList: any;
    studentExtraSubFieldList: any;

    initializeAdapter(vm: GenerateGoshwaraComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach((key) => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    // initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        const request_mp_board_report_card_mapping_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        this.vm.examinationOldService.getMpBoardReportCardMapping(request_mp_board_report_card_mapping_data, this.vm.user.jwt).then(
            (value) => {
                if (value == null) {
                    this.vm.reportCardMapping = null;
                    this.vm.isLoading = false;
                } else {
                    this.reportCardMapping = value;
                    this.vm.reportCardMapping = value;

                    const student_full_profile_request_data = {
                        schoolDbId: this.vm.user.activeSchool.dbId,
                        sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
                    };

                    const request_examination_data = {
                        id__in: this.getExaminationIdList(),
                    };

                    Promise.all([
                        this.vm.classService.getObjectList(this.vm.classService.classs, {}),
                        // this.vm.classOldService.getSectionList(this.vm.user.jwt),
                        this.vm.studentService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),
                        this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
                        this.vm.subjectService.getSubjectList(this.vm.user.jwt),
                        this.vm.subjectService.getExtraFieldList({}, this.vm.user.jwt),
                        this.vm.subjectService.getExtraSubFieldList({}, this.vm.user.jwt),
                    ]).then(
                        (value2) => {
                            console.log(value2);
                            this.classList = value2[0];
                            // this.sectionList = value2[1];
                            this.studentList = value2[1];
                            this.examinationList = value2[2];
                            this.subjectList = value2[3];
                            this.extraFieldList = value2[4];
                            this.extraSubFieldList = value2[5];

                            this.vm.subjectList = value2[3];
                            this.populateClassStudentList();
                            this.vm.isLoading = false;
                        },
                        (error) => {
                            this.vm.isLoading = false;
                        }
                    );
                }
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    getExaminationIdList(): any {
        let id_list = [];

        if (id_list.indexOf(this.reportCardMapping.parentExaminationJuly) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationJuly);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationAugust) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationAugust);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationSeptember) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationSeptember);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationOctober) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationOctober);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationHalfYearly) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationHalfYearly);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationDecember) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationDecember);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationJanuary) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationJanuary);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationFebruary) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationFebruary);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationFinal) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationFinal);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationProject) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationProject);
        }

        return id_list;
    }

    populateClassStudentList(): void {
        this.vm.classStudentList = [];
        this.classList
            .filter((item) => {
                if (
                    item.name == 'Class - 1' ||
                    item.name == 'Class - 2' ||
                    item.name == 'Class - 3' ||
                    item.name == 'Class - 4' ||
                    item.name == 'Class - 5' ||
                    item.name == 'Class - 6' ||
                    item.name == 'Class - 7' ||
                    item.name == 'Class - 8'
                ) {
                    return true;
                }
                return false;
            })
            .forEach((classs) => {
                let tempClass = this.copyObject(classs);
                tempClass['studentList'] = [];
                this.studentList
                    .filter((student) => {
                        return student.parentTransferCertificate === null;
                    })
                    .forEach((student) => {
                        if (student.classDbId === classs.id) {
                            tempClass['studentList'].push(student);
                        }
                    });
                if (tempClass['studentList'].length > 0) {
                    this.vm.classStudentList.push(tempClass);
                }
            });
        if (this.vm.classStudentList.length > 0) {
            this.vm.selectedClass = this.vm.classStudentList[0];
        }
    }

    // Get Class Patrak Details
    getClassGoshwara(): void {
        let request_class_subject_data = {
            subjectList: [],
            schoolList: [this.vm.user.activeSchool.dbId],
            employeeList: [],
            classList: [this.vm.selectedClass.id],
            sectionList: [1],
            sessionList: [this.vm.user.activeSchool.currentSessionDbId],
            mainSubject: [],
            onlyGrade: [],
        };

        this.vm.isLoading = true;

        this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt).then(
            (valueOne) => {
                console.log(valueOne);

                if (valueOne.length == 0) {
                    alert('No subjects added in class');
                    this.vm.isLoading = false;
                    return;
                }

                this.classSubjectList = valueOne
                    .filter((a) => {
                        return a.mainSubject;
                    })
                    .sort((a, b) => {
                        return a.orderNumber - b.orderNumber;
                    });
                this.vm.classSubjectList = this.classSubjectList;

                let request_student_subject_data = {
                    studentList: this.vm.selectedClass.studentList.map((a) => a.dbId),
                    subjectList: this.classSubjectList.map((a) => a.parentSubject),
                    sessionList: [this.vm.user.activeSchool.currentSessionDbId],
                };

                let request_class_test_data = {
                    parentExamination__in: this.getExaminationIdList(),
                    parentClass: this.vm.selectedClass.id,
                    parentDivision: 1,
                    parentSubject__in: this.classSubjectList.map((a) => a.parentSubject),
                };

                let request_student_test_data = {
                    studentList: this.vm.selectedClass.studentList.map((a) => a.dbId),
                    examinationList: this.getExaminationIdList(),
                    subjectList: this.classSubjectList.map((a) => a.parentSubject),
                    testTypeList: [],
                    marksObtainedList: [],
                };

                let request_student_extra_sub_field_data = {
                    studentList: this.vm.selectedClass.studentList.map((a) => a.dbId).join(),
                    examinationList: this.getExaminationIdList().join(),
                };

                let request_array = [];
                request_array.push(this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt));
                request_array.push(
                    this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_class_test_data)
                );
                request_array.push(this.vm.examinationOldService.getStudentTestList(request_student_test_data, this.vm.user.jwt));
                request_array.push(
                    this.vm.examinationOldService.getStudentExtraSubFieldList(request_student_extra_sub_field_data, this.vm.user.jwt)
                );

                Promise.all(request_array).then(
                    (valueTwo) => {
                        console.log(valueTwo);

                        this.studentSubjectList = valueTwo[0];
                        this.classTestList = valueTwo[1];
                        this.studentTestList = valueTwo[2];
                        this.studentExtraSubFieldList = valueTwo[3];
                        this.populateIncludeProject();
                        this.populateExtraFieldList();
                        this.populateStudentFinalReportCard();
                        this.vm.downloadGoshwara();
                        this.vm.isLoading = false;
                    },
                    (error) => {
                        this.vm.isLoading = false;
                    }
                );
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateIncludeProject(): void {
        switch (this.vm.selectedClass.name) {
            case 'Class - 6':
            case 'Class - 7':
            case 'Class - 8':
                this.vm.includeProject = true;
                break;
            default:
                this.vm.includeProject = false;
        }
    }

    populateExtraFieldList(): void {
        this.vm.extraFieldList = this.extraFieldList;
        this.vm.extraFieldList.forEach((extraField) => {
            extraField['extraSubFieldList'] = [];
            this.extraSubFieldList.forEach((extraSubField) => {
                if (extraSubField.parentExtraField == extraField.id) {
                    extraField['extraSubFieldList'].push(this.copyObject(extraSubField));
                }
            });
        });
    }

    populateStudentFinalReportCard(): void {
        this.vm.studentFinalReportCardList = this.vm.selectedClass.studentList;
        this.vm.studentFinalReportCardList.forEach((student) => {
            student['mainSubjectList'] = this.getStudentSubjectList(student.dbId);
            Object.keys(this.vm.reportCardMapping).forEach((key) => {
                if (key.match('parentExamination')) {
                    student[key] = {};
                    let maximumMarks = 10;
                    switch (key) {
                        case 'parentExaminationHalfYearly':
                            maximumMarks = 50;
                            break;
                        case 'parentExaminationFinal':
                            maximumMarks = 100;
                            break;
                        case 'parentExaminationProject':
                            maximumMarks = 20;
                            break;
                    }
                    student[key]['maximumMarks'] = maximumMarks;
                    student[key]['mainSubjectMarksList'] = [];
                    student['mainSubjectList'].forEach((item) => {
                        student[key]['mainSubjectMarksList'].push(
                            this.getStudentSubjectMarks(student.dbId, item.parentSubject, this.vm.reportCardMapping[key], maximumMarks)
                        );
                    });
                    student[key]['extraSubFieldMarksList'] = [];
                    if (key != 'parentExaminationProject') {
                        this.vm.extraFieldList.forEach((extraField) => {
                            extraField['extraSubFieldList'].forEach((extraSubField) => {
                                student[key]['extraSubFieldMarksList'].push(
                                    this.getStudentExtraSubFieldMarks(student.dbId, extraSubField.id, this.vm.reportCardMapping[key])
                                );
                            });
                        });
                    }
                }
            });
        });
    }

    getStudentSubjectList(studentId: any): any {
        let subjectList = [];
        this.classSubjectList.forEach((item) => {
            subjectList.push(item);
        });
        return subjectList;
    }

    getStudentSubjectMarks(studentId: any, subjectId: any, examinationId: any, maximumMarks: any): any {
        let classMarks = 0;
        let studentMarks = 0;
        this.classTestList.forEach((item) => {
            if (item.parentSubject == subjectId && item.parentExamination == examinationId) {
                classMarks += parseFloat(item.maximumMarks);
            }
        });
        this.studentTestList.forEach((item) => {
            if (item.parentStudent == studentId && item.parentSubject == subjectId && item.parentExamination == examinationId) {
                studentMarks += parseFloat(item.marksObtained);
            }
        });
        if (classMarks == 0) {
            classMarks = 1;
        }
        return (studentMarks * maximumMarks) / classMarks;
    }

    getStudentExtraSubFieldMarks(studentId: any, extraSubFieldId: any, examinationId: any): any {
        let studentMarks = 0;
        this.studentExtraSubFieldList.every((item) => {
            if (item.parentStudent == studentId && item.parentExtraSubField == extraSubFieldId && item.parentExamination == examinationId) {
                studentMarks = parseFloat(item.marksObtained);
                return false;
            }
            return true;
        });
        return studentMarks;
    }
}
