import { PrintMarksheetComponent } from './print-marksheet.component';

import { TEST_TYPE_LIST } from '../../../../classes/constants/test-type';

export class PrintMarksheetServiceAdapter {
    vm: PrintMarksheetComponent;

    test_type_list = TEST_TYPE_LIST;

    constructor() {}

    // Data
    examinationList: any;
    classList: any;
    sectionList: any;
    subjectList: any;

    testList: any;
    classSubjectList: any;

    student_full_profile_list: any;

    initializeAdapter(vm: PrintMarksheetComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach((key) => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    //initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;

        let request_examination_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let request_class_subject_data = {
            subjectList: [],
            classList: [],
            sectionList: [],
            employeeList: [],
            schoolList: [this.vm.user.activeSchool.dbId],
            sessionList: [this.vm.user.activeSchool.currentSessionDbId],
            mainSubject: [],
            onlyGrade: [],
        };

        let request_student_mini_profile_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
            this.vm.studentService.getStudentFullProfileList(request_student_mini_profile_data, this.vm.user.jwt),
            this.vm.schoolService.getObjectList(this.vm.schoolService.board, {}),
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}),
        ]).then(
            (value) => {
                console.log(value);

                this.examinationList = value[0];
                this.classList = value[1];
                this.sectionList = value[2];
                this.subjectList = value[3];
                this.classSubjectList = value[4];
                this.student_full_profile_list = value[5];
                this.vm.student_full_profile_list = value[5];
                this.vm.boardList = value[6];
                this.vm.sessionList = value[7];

                let service_list = [];

                let examination_id_list = this.getExaminationIdList();

                this.classSubjectList.forEach((item) => {
                    let request_class_test_data = {
                        /*'examinationId': this.vm.selectedExamination.id,
                    'classId': this.vm.selectedExamination.selectedClass.id,
                    'sectionId': this.vm.selectedExamination.selectedClass.selectedSection.id,*/
                        parentExamination__in: examination_id_list,
                        parentClass: item.parentClass,
                        parentDivision: item.parentDivision,
                        parentSubject: item.parentSubject,
                    };

                    /*let request_class_test_data = {
                    'examinationList': [examination_id_list],
                    'subjectList': [item.parentSubject],
                    'classList': [item.parentClass],
                    'sectionList': [item.parentDivision],
                    'startTimeList': [],
                    'endTimeList': [],
                    'testTypeList': [],
                    'maximumMarksList': [],
                };*/

                    service_list.push(
                        this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_class_test_data)
                    );
                });

                Promise.all(service_list).then((value) => {
                    this.testList = [];

                    value.forEach((item) => {
                        if (item.length > 0) {
                            item.forEach((itemTwo) => {
                                this.testList.push(itemTwo);
                            });
                        }
                    });

                    this.populateExaminationClassSectionSubjectList();
                    this.vm.subjectList = this.subjectList;
                    this.vm.isInitialLoading = false;
                });
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    getExaminationIdList(): any {
        let id_list = [];
        this.examinationList.forEach((item) => {
            id_list.push(item.id);
        });
        return id_list;
    }

    populateExaminationClassSectionSubjectList(): void {
        this.vm.examinationClassSectionList = [];
        this.examinationList.forEach((examination) => {
            if (this.isExaminationInTestList(examination)) {
                let tempExamination = this.copyObject(examination);

                tempExamination['classList'] = [];

                this.classList.forEach((classs) => {
                    if (this.isExaminationClassInTestList(examination, classs)) {
                        let tempClass = this.copyObject(classs);

                        tempClass['sectionList'] = [];

                        this.sectionList.forEach((section) => {
                            if (this.isExaminationClassSectionInTestList(examination, classs, section)) {
                                let tempSection = this.copyObject(section);

                                tempSection['subjectList'] = [];

                                this.subjectList.forEach((subject) => {
                                    let testDetails = this.getTestDetails(examination, classs, section, subject);

                                    if (testDetails.length > 0) {
                                        let tempSubject = this.copyObject(subject);

                                        tempSubject['mainSubject'] = this.isMainSubject(tempSubject, classs.id);

                                        tempSubject['onlyGrade'] = this.isOnlyGrade(tempSubject, classs.id);

                                        tempSubject['testDetails'] = testDetails;

                                        tempSubject['orderNumber'] = this.getOrderNumber(tempSubject, classs.id);

                                        tempSection['subjectList'].push(tempSubject);
                                    }
                                });

                                tempSection['subjectList'] = tempSection['subjectList'].sort((a, b) => {
                                    return a.orderNumber - b.orderNumber;
                                });

                                tempClass['sectionList'].push(tempSection);
                            }
                        });

                        tempClass['selectedSection'] = tempClass['sectionList'][0];

                        tempExamination['classList'].push(tempClass);
                    }
                });

                tempExamination['selectedClass'] = tempExamination['classList'][0];

                this.vm.examinationClassSectionList.push(tempExamination);
            }
        });
        this.vm.selectedExamination = this.vm.examinationClassSectionList[0];
    }

    isMainSubject(subject: any, classDbId: any): boolean {
        let result = true;
        this.classSubjectList.every((item) => {
            if (subject.id === item.parentSubject && classDbId === item.parentClass && item.mainSubject === false) {
                result = false;
                return false;
            }
            return true;
        });
        return result;
    }

    isOnlyGrade(subject: any, classDbId: any): boolean {
        let result = true;
        this.classSubjectList.every((item) => {
            if (subject.id === item.parentSubject && classDbId === item.parentClass && item.onlyGrade === false) {
                result = false;
                return false;
            }
            return true;
        });
        return result;
    }

    getOrderNumber(subject: any, classDbId: any): any {
        let result = 0;
        this.classSubjectList.every((item) => {
            if (subject.id === item.parentSubject && classDbId === item.parentClass) {
                result = item.orderNumber;
                return false;
            }
            return true;
        });
        return result;
    }

    isExaminationInTestList(examination: any): boolean {
        let result = false;
        this.testList.every((item) => {
            if (item.parentExamination === examination.id) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    isExaminationClassInTestList(examination: any, classs: any): boolean {
        let result = false;
        this.testList.every((item) => {
            if (item.parentClass === classs.id && item.parentExamination === examination.id) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    isExaminationClassSectionInTestList(examination: any, classs: any, section: any): boolean {
        let result = false;
        this.testList.every((item) => {
            if (item.parentExamination === examination.id && item.parentClass === classs.id && item.parentDivision === section.id) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    getTestDetails(examination: any, classs: any, section: any, subject: any): any {
        let result = [];
        this.testList.forEach((item) => {
            if (
                item.parentExamination === examination.id &&
                item.parentClass === classs.id &&
                item.parentDivision === section.id &&
                item.parentSubject === subject.id
            ) {
                result.push(item);
            }
        });
        return result.sort((a, b) => {
            if (a.testType === null) {
                return 0;
            } else if (b.testType === null) {
                return 1;
            }
            return a.testType - b.testType;
        });
    }

    // Get Student Test Details
    getStudentTestDetails(): void {
        this.vm.isLoading = true;

        let request_student_test_data = {
            studentList: this.getStudentIdListForSelectedItems(),
            subjectList: this.getSubjectIdListForSelectedItems(),
            examinationList: [this.vm.selectedExamination.id],
            marksObtainedList: [],
            testTypeList: [],
        };

        this.vm.examinationOldService.getStudentTestList(request_student_test_data, this.vm.user.jwt).then(
            (value2) => {
                console.log(value2);
                this.populateStudentList(value2);
                this.vm.showTestDetails = true;
                this.vm.isLoading = false;
                this.vm.printMarksheet();
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    getStudentIdListForSelectedItems(): any {
        let id_list = [];
        this.student_full_profile_list.forEach((item) => {
            if (
                item.classDbId === this.vm.selectedExamination.selectedClass.id &&
                item.sectionDbId === this.vm.selectedExamination.selectedClass.selectedSection.id
            ) {
                id_list.push(item.dbId);
            }
        });
        return id_list;
    }

    getSubjectIdListForSelectedItems(): any {
        let id_list = [];
        this.vm.selectedExamination.selectedClass.selectedSection.subjectList.forEach((item) => {
            id_list.push(item.id);
        });
        return id_list;
    }

    populateStudentList(student_test_list: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection['studentList'] = [];
        this.student_full_profile_list
            .filter((item) => {
                if (
                    item.classDbId === this.vm.selectedExamination.selectedClass.id &&
                    item.sectionDbId === this.vm.selectedExamination.selectedClass.selectedSection.id
                ) {
                    return true;
                }
                return false;
            })
            .forEach((item) => {
                let tempItem = {};
                tempItem = this.copyObject(item);
                tempItem['subjectList'] = [];
                this.vm.selectedExamination.selectedClass.selectedSection['subjectList'].forEach((itemTwo) => {
                    let tempItemTwo = {};
                    tempItemTwo = this.copyObject(itemTwo);
                    tempItemTwo['testDetails'] = this.getStudentTestList(tempItemTwo, tempItem, student_test_list);
                    if (tempItemTwo['testDetails'].length > 0) {
                        tempItem['subjectList'].push(tempItemTwo);
                    }
                });
                this.vm.selectedExamination.selectedClass.selectedSection['studentList'].push(tempItem);
            });
    }

    getStudentTestList(subject: any, student: any, student_test_list: any): any {
        let result = [];
        student_test_list.forEach((item) => {
            if (item.parentStudent === student.dbId && item.parentSubject === subject.id) {
                result.push(item);
            }
        });
        return result.sort((a, b) => {
            if (a.testType === null) {
                return 0;
            } else if (b.testType === null) {
                return 1;
            }
            return a.testType - b.testType;
        });
    }
}
