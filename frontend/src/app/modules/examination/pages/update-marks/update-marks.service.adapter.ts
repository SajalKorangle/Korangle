import { UpdateMarksComponent } from './update-marks.component';

import { TEST_TYPE_LIST } from '../../../../classes/constants/test-type';
import {CommonFunctions} from '@modules/common/common-functions';
import { Query } from '@services/generic/query';

export class UpdateMarksServiceAdapter {
    vm: UpdateMarksComponent;

    test_type_list = TEST_TYPE_LIST;
    student_section_data_list: any;
    student_data_list: any;

    STUDENT_LIMITER = 200;

    constructor() {}

    // Data
    examinationList: any;
    classList: any;
    sectionList: any;
    subjectList: any;
    testList: any;
    classSubjectList: any;

    student_mini_profile_list: any = [];

    initializeAdapter(vm: UpdateMarksComponent): void {
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
    async initializeData() {
        this.vm.isInitialLoading = true;
        this.vm.isUpdated = false;

        const routeInformation = CommonFunctions.getModuleTaskPaths();
        const in_page_permission_request = {
            parentTask__parentModule__path: routeInformation.modulePath,
            parentTask__path: routeInformation.taskPath,
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };

         this.vm.inPagePermissionMappedByKey = (await
             this.vm.employeeService.getObject(this.vm.employeeService.employee_permissions, in_page_permission_request)).configJSON;

        let request_examination_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let request_class_subject_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        if (!this.vm.hasAdminPermission()) {
            request_class_subject_data['parentEmployee'] = this.vm.user.activeSchool.employeeId;
        }

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_data),
        ]).then(
            (value) => {
                this.examinationList = value[0];
                this.classList = value[1];
                this.sectionList = value[2];
                this.subjectList = value[3];
                this.classSubjectList = value[4];

                let classes = [],
                    sections = [];
                value[4].forEach((classSubject) => {
                    classes.push(classSubject.parentClass);
                    sections.push(classSubject.parentDivision);
                });

                let request_student_section_data = {
                    parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                    parentClass__in: classes,
                    parentDivision__in: sections,
                    parentSession: this.vm.user.activeSchool.currentSessionDbId,
                };

                this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data).then((value) => {
                    this.student_section_data_list = value;

                    let studentInThisClassSection = [];
                    this.student_section_data_list.forEach((studentSection) => {
                        studentInThisClassSection.push(studentSection.parentStudent);
                    });

                    let service_list = [];
                    const iterationCount = Math.ceil(studentInThisClassSection.length / this.STUDENT_LIMITER);
                    let loopVariable = 0;

                    while (loopVariable < iterationCount) {
                        const request_student_mini_profile_data_new = {
                            id__in: studentInThisClassSection
                                .slice(this.STUDENT_LIMITER * loopVariable, this.STUDENT_LIMITER * (loopVariable + 1))
                                .join(','),
                            fields__korangle: 'id,name,fathersName,profileImage,gender,scholarNumber,parentTransferCertificate',
                        };
                        service_list.push(
                            this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_mini_profile_data_new)
                        );
                        loopVariable = loopVariable + 1;
                    }

                    Promise.all(service_list).then((value) => {
                        this.student_data_list = [];
                        value.forEach((item) => {
                            this.student_data_list = this.student_data_list.concat(item);
                        });

                        this.student_data_list.forEach((student) => {
                            this.student_section_data_list.forEach((stud_sec) => {
                                if (stud_sec.parentStudent === student.id) {
                                    let data = {
                                        dbId: student.id,
                                        name: student.name,
                                        fatherName: student.fatherName,
                                        gender: student.gender,
                                        profileImage: student.profileImage,
                                        scholarNumber: student.scholarNumber,
                                        parentTransferCertificate: student.parentTransferCertificate,
                                        classDbId: stud_sec.parentClass,
                                        className: this.getClassName(stud_sec.parentClass),
                                        sectionDbId: stud_sec.parentDivision,
                                        sectionName: this.getSectionName(stud_sec.parentDivision),
                                        studentSectionDbId: stud_sec.id,
                                        rollNumber: stud_sec.rollNumber,
                                    };
                                    this.vm.student_mini_profile_list.push(data);
                                    this.student_mini_profile_list.push(data);
                                }
                            });
                        });

                        let service_list = [];

                        let examination_id_list = this.getExaminationIdList();

                        this.classSubjectList.forEach((item) => {
                            let request_class_test_data = {
                                parentExamination__in: examination_id_list,
                                parentClass: item.parentClass,
                                parentDivision: item.parentDivision,
                                parentSubject: item.parentSubject,
                            };

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
                    });
                });
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }
    getSectionName(sectionId: any): any {
        let result = '';
        this.sectionList.every((item) => {
            if (item.id === sectionId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }
    getClassName(classId: any): any {
        let result = '';
        this.classList.every((item) => {
            if (item.id === classId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getStudentIdList(studentList): any {
        let result = [];
        studentList.forEach((student) => {
            result.push(student.id);
        });
        return result;
    }

    getExaminationIdList(): any {
        let id_list = [];
        this.examinationList.forEach((item) => {
            id_list.push(item.id);
        });
        return id_list;
    }

    populateExaminationClassSectionSubjectList(): void {
        this.vm.examinationClassSectionSubjectList = [];
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
                                tempSection['testList'] = [];

                                this.subjectList.forEach((subject) => {
                                    let testDetails = this.getTestDetails(examination, classs, section, subject);

                                    if (testDetails.length > 0) {
                                        for (let i = 0; i < testDetails.length; i++) {
                                            let test = testDetails[i];
                                            test['name'] = subject.name;
                                            if (test.testType) {
                                                test['name'] += ' - ' + test.testType;
                                            }
                                            test['isSelected'] = false;
                                            test['subject'] = subject;
                                            tempSection['testList'].push(test);
                                        }

                                        tempSection['subjectList'].push(subject);
                                    }
                                });

                                tempSection['testList'].sort((a, b) => {
                                    return a.name.localeCompare(b.name);
                                });

                                tempSection['selectedTestList'] = [];

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
        this.vm.isUpdated = false;
        this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList.studentList = [];

        let selectedSubjectIDList = [];
        this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList.forEach((test) => {
            if (selectedSubjectIDList.indexOf(test.subject.id) === -1) {
                selectedSubjectIDList.push(test.subject.id);
            }
        });

        let query = {
            parentExamination: this.vm.selectedExamination.id,
            parentSubject__in: selectedSubjectIDList,
            parentStudent__in: this.getStudentIdListForSelectedItems(),
        };

        let studentSubjectQuery = new Query()
        .filter({
            parentSubject__in: selectedSubjectIDList,
            parentStudent__in: this.getStudentIdListForSelectedItems(),
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        })
        .getObjectList({subject_app: 'StudentSubject'});

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.student_test, query),
            studentSubjectQuery,
        ])
        .then(
            (response) => {
                let selectedTestList = this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList;

                // clean the result
                let cleanedResponse = [];
                response[0].forEach((item) => {
                    selectedTestList.forEach((test) => {
                        if (test.subject.id === item.parentSubject) {
                            if ( (test.testType == null && item.testType == null) || (test.testType === item.testType)) {
                                cleanedResponse.push(item);
                            }
                        }

                    });
                });
                // end of clean the result
                return [cleanedResponse, response[1]];
            }).then((response) => {
                this.populateStudentTestList(response[0], response[1]);
                let subjectMap = new Map<number, string>();
                let subjectMaxMarksMap = new Map<string, number>();
                this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList.forEach((test) => {
                    if (!subjectMap.has(test.id)) {
                        subjectMap.set(test.id, test.name);
                    }
                    if (!subjectMaxMarksMap.has(test.name)) {
                        subjectMaxMarksMap.set(test.name, test.maximumMarks);
                    }
                }
                );

                // add subject name to each student's test data
                this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList.studentList.forEach((student) => {
                    student.testData.forEach((testDataSingle) => {
                        testDataSingle['subjectName'] = subjectMap.get(testDataSingle.testId);
                        let subjectFullName = testDataSingle['subjectName'];

                        if (!testDataSingle['subjectFullName']) {
                            testDataSingle['subjectFullName'] = subjectFullName;
                        }
                        testDataSingle['maximumMarks'] = subjectMaxMarksMap.get(testDataSingle['subjectFullName']);
                    }

                    );
                }
                );

                this.sortStudentListByRollNumber();
                this.sortTestDataBySubjectName();
                this.vm.isLoading = false;
                this.vm.showTestDetails = true;
            }).catch((error) => {
                this.vm.isLoading = false;
            });

    }

    sortStudentListByRollNumber(): void {
        this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList.studentList.sort((a, b) => {
            if (a.rollNumber && b.rollNumber) {
                return a.rollNumber.toString() < b.rollNumber.toString() ? -1 : 1;
            }
            return b.rollNumber ? -1 : 1;
        });
    }

    sortselectedTestListBySubjectName(): void {
        this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList.sort((a, b) => {
            return a.name.localeCompare(b.name);
        }
        );
    }

    sortTestDataBySubjectName() {
        this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList.studentList.forEach((student) => {
            student.testData.sort((a, b) => {
                return a.subjectFullName.localeCompare(b.subjectFullName);
            });
        }
        );
    }

    getStudentIdListForSelectedItems(): any {
        let id_list = [];
        this.student_mini_profile_list.forEach((item) => {
            if (
                item.classDbId === this.vm.selectedExamination.selectedClass.id &&
                item.sectionDbId === this.vm.selectedExamination.selectedClass.selectedSection.id
            ) {
                id_list.push(item.dbId);
            }
        });
        return id_list;
    }

    populateStudentTestList(studentTestList: any, studentSubjectList: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList['studentList'] = [];
        this.student_mini_profile_list.filter(
            (item) => item.classDbId === this.vm.selectedExamination.selectedClass.id &&
            item.sectionDbId === this.vm.selectedExamination.selectedClass.selectedSection.id
        ).sort((a, b) => {
            if (a.rollNumber && b.rollNumber) {
                return a.rollNumber.toString() < b.rollNumber.toString() ? -1 : 1;
            }
            return b.rollNumber ? -1 : 1;
        }).forEach((student) => {
            let studentData = [];
            studentTestList.forEach((item) => {
                if (item.parentStudent === student.dbId) {
                    if (item.marksObtained === null) {
                        item.marksObtained = 0;
                    } else {
                        item.marksObtained = Number(item.marksObtained.toString());
                    }
                    item['studentSubjectExists'] = false; // we will decide later on, whether student is studing the subject of this test or not.
                    studentData.push(item);
                }
            });

            // Starts :- Remove Duplicate Marks for same test from student Data
            let indexToBeDeletedList = [];
            studentData.forEach((itemOne, indexOne) => {
                studentData.forEach((itemTwo, indexTwo) => {
                    if (
                        itemOne.parentSubject == itemTwo.parentSubject &&
                        itemOne.testType == itemTwo.testType &&
                        itemOne.id != itemTwo.id
                    ) {
                        let index = itemOne.id < itemTwo.id ? indexTwo : indexOne;
                        if (!(indexToBeDeletedList.includes(index))) {
                            indexToBeDeletedList.push(index);
                        }
                    }
                });
            });
            for (let loop = 0; loop < indexToBeDeletedList.length; loop++) {
                delete studentData[indexToBeDeletedList[loop]];
            }
            studentData = studentData.filter(item => item != undefined);
            // Ends :- Remove Duplicate Marks for same test from student Data

            if (studentData.length < this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList.length) {
                this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList.forEach((test) => {
                    if (studentData.filter((item) => item.parentSubject === test.subject.id && item.testType === test.testType).length === 0) {
                        studentData.push({
                            id: null,
                            parentStudent: student.dbId,
                            parentSubject: test.subject.id,
                            parentExamination: this.vm.selectedExamination.id,
                            marksObtained: null,
                            absent: false,
                            testType: test.testType,
                            subjectName: test.name,
                            studentSubjectExists: false, // we will decide later on, whether student is studing the subject of this test or not.
                        });
                    }
                });
            }

            // Starts: Deciding whether student is studing the subject of selected tests or not
            studentData.forEach(studentDataItem => {
                studentDataItem.studentSubjectExists = studentSubjectList.find(studentSubject => {
                    return studentSubject.parentSubject == studentDataItem.parentSubject &&
                        studentSubject.parentStudent == studentDataItem.parentStudent;
                }) != undefined;
            });
            // Ends: Deciding whether student is studing the subject of selected tests or not

            //Starts: Adding testId to studentData
            this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList.forEach((test) => {
                studentData.forEach((dataItem) => {
                    if (dataItem.parentSubject === test.parentSubject && dataItem.testType === test.testType) {
                        dataItem['testId'] = test.id;
                    }
                });
            });

            //Ends: Adding testId to studentData

            student['testData'] = studentData;
            this.vm.selectedExamination.selectedClass.selectedSection.selectedTestList['studentList'].push(student);
        });
    }

    getStudentTestList(student: any, student_test_list: any, testTypeListInCurrentTest: any): any {
        let result = [];
        testTypeListInCurrentTest.forEach((testType) => {
            var studentPresent = false;
            student_test_list.forEach((item) => {
                if (item.parentStudent === student.dbId && item.testType === testType) {
                    studentPresent = true;
                    if (item.marksObtained == 0.0) {
                        item.marksObtained = null;
                    } else {
                        item.marksObtained = Number(item.marksObtained.toString());
                        let mark = item.marksObtained;
                    }
                    result.push(item);
                }
            });
            if (!studentPresent) {
                result.push({
                    id: null,
                    parentStudent: student.dbId,
                    parentSubject: this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject.id,
                    parentExamination: this.vm.selectedExamination.id,
                    marksObtained: null,
                    absent: false,
                    testType: testType,
                });
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

    // Create Student Test Details
    createStudentTestDetails(studentTest: any, event: any): void {
        const newStudentTest = this.copyObject(studentTest);
        if (newStudentTest.marksObtained == null) {
            newStudentTest.marksObtained = 0;
        }
        Promise.all([
            this.vm.examinationService.createObject(this.vm.examinationService.student_test, newStudentTest),
        ]).then(
            (value) => {
                studentTest.id = value[0].id;
                this.vm.isUpdated = false;
                if (event) {
                    this.vm.renderer.removeClass(event.target, 'updatingField');
                }
            },
            (error) => {
                if (event) {
                    this.vm.renderer.removeClass(event.target, 'updatingField');
                }
            }
        );
    }

    // Update Student Test Details
    updateStudentTestDetails(studentTest: any, event: any): void {
        const newStudentTest = this.copyObject(studentTest);
        if (newStudentTest.marksObtained == null) {
            newStudentTest.marksObtained = 0;
        }
        Promise.all([
            this.vm.examinationService.updateObject(this.vm.examinationService.student_test, newStudentTest),
        ]).then(
            (value) => {
                this.vm.isUpdated = false;
                if (event) {
                    this.vm.renderer.removeClass(event.target, 'updatingField');
                }
            },
            (error) => {
                if (event) {
                    this.vm.renderer.removeClass(event.target, 'updatingField');
                }
            }
        );
    }
}
