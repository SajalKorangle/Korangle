
import {UpdateMarksComponent} from './update-marks.component';

import { TEST_TYPE_LIST } from '../../classes/constants';

export class UpdateMarksServiceAdapter {

    vm: UpdateMarksComponent;

    test_type_list = TEST_TYPE_LIST;

    constructor() {}

    // Data
    examinationList: any;
    classList: any;
    sectionList: any;
    subjectList: any;

    testList: any;
    classSubjectList: any;

    student_mini_profile_list: any;


    initializeAdapter(vm: UpdateMarksComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    //initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;

        let request_examination_data = {
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
            'schoolId': this.vm.user.activeSchool.dbId,
        };

        let request_class_subject_data = {
            'subjectList': [],
            'classList': [],
            'sectionList': [],
            'employeeList': [this.vm.user.activeSchool.employeeId],
            'schoolList': [this.vm.user.activeSchool.dbId],
            'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
            'mainSubject': [],
            'onlyGrade': [],
        };

        let request_student_mini_profile_data = {
            'schoolDbId': this.vm.user.activeSchool.dbId,
            'sessionDbId': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.examinationService.getExaminationList(request_examination_data, this.vm.user.jwt),
            this.vm.classService.getClassList(this.vm.user.jwt),
            this.vm.classService.getSectionList(this.vm.user.jwt),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
            this.vm.studentService.getStudentMiniProfileList(request_student_mini_profile_data, this.vm.user.jwt),
        ]).then(value => {

            this.examinationList = value[0];
            this.classList = value[1];
            this.sectionList = value[2];
            this.subjectList = value[3];
            this.classSubjectList = value[4];
            this.student_mini_profile_list = value[5];
            this.vm.student_mini_profile_list = value[5];

            let service_list = [];

            let examination_id_list = this.getExaminationIdList();

            this.classSubjectList.forEach(item => {

                let request_class_test_data = {
                    'examinationList': [examination_id_list],
                    'subjectList': [item.parentSubject],
                    'classList': [item.parentClass],
                    'sectionList': [item.parentDivision],
                    'startTimeList': [],
                    'endTimeList': [],
                    'testTypeList': [],
                    'maximumMarksList': [],
                };

                service_list.push(this.vm.examinationService.getTestList(request_class_test_data, this.vm.user.jwt));

            });

            Promise.all(service_list).then(value => {

                this.testList = [];

                value.forEach(item => {
                    if (item.length > 0) {
                        item.forEach(itemTwo => {
                            this.testList.push(itemTwo);
                        });
                    }
                });

                this.populateExaminationClassSectionSubjectList();
                this.vm.subjectList = this.subjectList;
                this.vm.isInitialLoading = false;

            });

        }, error => {
            this.vm.isInitialLoading = false;
        });

    }

    getExaminationIdList(): any {
        let id_list = [];
        this.examinationList.forEach(item => {
            id_list.push(item.id);
        });
        return id_list;
    }

    populateExaminationClassSectionSubjectList(): void {
        this.vm.examinationClassSectionSubjectList = [];
        this.examinationList.forEach(examination => {
            if (this.isExaminationInTestList(examination)) {

                let tempExamination = this.copyObject(examination);

                tempExamination['classList'] = [];

                this.classList.forEach(classs => {
                    if (this.isExaminationClassInTestList(examination, classs)) {

                        let tempClass = this.copyObject(classs);

                        tempClass['sectionList'] = [];

                        this.sectionList.forEach(section => {
                            if (this.isExaminationClassSectionInTestList(examination, classs, section)) {

                                let tempSection = this.copyObject(section);

                                tempSection['subjectList'] = [];

                                this.subjectList.forEach(subject => {

                                    let testDetails = this.getTestDetails(examination, classs, section, subject);

                                    if (testDetails.length > 0) {

                                        let tempSubject = this.copyObject(subject);

                                        tempSubject['testDetails'] = testDetails;

                                        tempSection['subjectList'].push(tempSubject);

                                    }

                                });

                                tempSection['selectedSubject'] = tempSection['subjectList'][0];

                                tempClass['sectionList'].push(tempSection);

                            }
                        });

                        tempClass['selectedSection'] = tempClass['sectionList'][0];

                        tempExamination['classList'].push(tempClass);

                    }
                });

                tempExamination['selectedClass'] = tempExamination['classList'][0];

                this.vm.examinationClassSectionSubjectList.push(tempExamination);

            }
        });
        this.vm.selectedExamination = this.vm.examinationClassSectionSubjectList[0];

        console.log(this.vm.examinationClassSectionSubjectList);

    }

    isExaminationInTestList(examination: any): boolean {
        let result = false;
        this.testList.every(item => {
            if (item.parentExamination === examination.id) {
                result = true;
                return false;
            }
            return true;
        });
        return result
    }

    isExaminationClassInTestList(examination: any, classs: any): boolean {
        let result = false;
        this.testList.every(item => {
            if (item.parentClass === classs.dbId
                && item.parentExamination === examination.id) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    isExaminationClassSectionInTestList(examination: any, classs: any, section: any): boolean {
        let result = false;
        this.testList.every(item => {
            if (item.parentExamination === examination.id
                && item.parentClass === classs.dbId
                && item.parentDivision === section.id) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    getTestDetails(examination: any, classs: any, section: any, subject: any): any {
        let result = [];
        this.testList.forEach(item => {
            if (item.parentExamination === examination.id
                && item.parentClass === classs.dbId
                && item.parentDivision === section.id
                && item.parentSubject === subject.id) {
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
            'studentList': this.getStudentIdListForSelectedItems(),
            'subjectList': [this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject.id],
            'examinationList': [this.vm.selectedExamination.id],
            'marksObtainedList': [],
            'testTypeList': [],
        };

        this.vm.examinationService.getStudentTestList(request_student_test_data, this.vm.user.jwt).then(value2 => {
            this.populateStudentList(value2);
            this.vm.showTestDetails = true;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })

    }

    getStudentIdListForSelectedItems(): any {
        let id_list = [];
        this.student_mini_profile_list.forEach(item => {
            if (item.classDbId === this.vm.selectedExamination.selectedClass.dbId
                && item.sectionDbId === this.vm.selectedExamination.selectedClass.selectedSection.id) {
                id_list.push(item.dbId);
            }
        });
        return id_list;
    }

    populateStudentList(student_test_list: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject['studentList'] = [];
        this.student_mini_profile_list.filter(item => {
            if (item.classDbId === this.vm.selectedExamination.selectedClass.dbId
                && item.sectionDbId === this.vm.selectedExamination.selectedClass.selectedSection.id) {
                return true;
            }
            return false;
        }).forEach(item => {
            let tempItem = {};
            tempItem = this.copyObject(item);
            tempItem['testDetails'] = this.getStudentTestList(tempItem, student_test_list);
            this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject['studentList'].push(tempItem);
        });
    }

    getStudentTestList(student: any, student_test_list: any): any {
        let result = [];
        student_test_list.forEach(item => {
            if (item.parentStudent === student.dbId) {
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


    // Update Student Test Details
    updateStudentTestDetails(): void {

        let data = [];

        this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject.studentList.forEach(item => {
            item.testDetails.forEach(itemTwo => {
                data.push(itemTwo);
            });
        });

        this.vm.isLoading = true;

        this.vm.examinationService.updateStudentTestList(data, this.vm.user.jwt).then(value => {
            alert('Student Marks updated successfully');
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

}