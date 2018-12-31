
import {CreateTestComponent} from './create-test.component';

import { TEST_TYPE_LIST } from '../../classes/constants';

export class CreateTestServiceAdapter {

    vm: CreateTestComponent;

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


    initializeAdapter(vm: CreateTestComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;

        let request_examination_data = {
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
            'schoolId': this.vm.user.activeSchool.dbId,
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
            this.vm.studentService.getStudentMiniProfileList(request_student_mini_profile_data, this.vm.user.jwt),
        ]).then(value => {
            this.examinationList = value[0];
            this.classList = value[1];
            this.sectionList = value[2];
            this.subjectList = value[3];
            this.student_mini_profile_list = value[4];
            this.populateExaminationClassSectionList();
            this.vm.subjectList = this.subjectList;
            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });

        /*this.vm.examinationService.getExaminationList(request_data, this.vm.user.jwt).then(value => {
            this.vm.examinationList = value;
            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });*/
    }

    populateExaminationClassSectionList(): void {
        this.vm.examinationClassSectionList = [];
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
                    tempSection['testList'] = [];
                    tempClass['sectionList'].push(tempSection);
                });
                tempClass['selectedSection'] = tempClass['sectionList'][0];
                tempExamination['classList'].push(tempClass);
            });
            tempExamination['selectedClass'] = tempExamination['classList'][0];
            this.vm.examinationClassSectionList.push(tempExamination);
        });
        this.vm.selectedExamination = this.vm.examinationClassSectionList[0];
    }

    //Get Test And Subject Details
    getTestAndSubjectDetails(): void {

        this.vm.isLoading = true;

        let request_test_data = {
            'examinationId': this.vm.selectedExamination.id,
            'classId': this.vm.selectedExamination.selectedClass.dbId,
            'sectionId': this.vm.selectedExamination.selectedClass.selectedSection.id,
        };

        let request_class_subject_data = {
            'classId': this.vm.selectedExamination.selectedClass.dbId,
            'sectionId': this.vm.selectedExamination.selectedClass.selectedSection.id,
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
            'schoolId': this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.examinationService.getTestList(request_test_data, this.vm.user.jwt),
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
        ]).then(value => {

            console.log(value);

            let student_id_list = this.getStudentIdListForSelectedItems();

            let request_student_test_data = {
                'studentList': student_id_list,
                'subjectList': [],
                'examinationList': [this.vm.selectedExamination.id],
                'testTypeList': [],
                'marksObtainedList': [],
            };

            let request_student_subject_data = {
                'studentList': student_id_list,
                'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
                'subjectList': [],
            };

            Promise.all([
                this.vm.examinationService.getStudentTestList(request_student_test_data, this.vm.user.jwt),
                this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt),
            ]).then(value2 => {

                this.classSubjectList = value[1];

                this.addTestListToExaminationList(value[0]);
                this.addStudentTestListToExaminationList(value2[0], true);
                this.addStudentSubjectListToExaminationList(value2[1]);
                this.populateSubjectList();
                this.vm.selectedSubject = null;
                this.vm.selectedTestType = null;
                this.vm.showTestDetails = true;
                this.vm.isLoading = false;

            });

        }, error => {
            this.vm.isLoading =false;
        });

    }

    getStudentIdListForSelectedItems(): any {
        let idList = [];
        this.student_mini_profile_list.forEach(item => {
            if (item.classDbId === this.vm.selectedExamination.selectedClass.dbId
                && item.sectionDbId === this.vm.selectedExamination.selectedClass.selectedSection.id) {
                idList.push(item.dbId);
            }
        });
        return idList;
    }

    addTestListToExaminationList(testList: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection.testList = [];
        testList.forEach(test => {
            this.addTestToTestList(test);
        });
    }

    addStudentTestListToExaminationList(studentTestList: any, initial: boolean): void {
        if (initial) {
            this.vm.selectedExamination.selectedClass.selectedSection['studentTestList'] = [];
        }
        studentTestList.forEach(item => {
            let tempItem = {};
            Object.keys(item).forEach(key => {
                tempItem[key] = item[key];
            });
            this.vm.selectedExamination.selectedClass.selectedSection.studentTestList.push(tempItem);
        })
    }

    addStudentSubjectListToExaminationList(studentSubjectList: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection['studentSubjectList'] = [];
        studentSubjectList.forEach(item => {
            let tempItem = {};
            Object.keys(item).forEach(key => {
                tempItem[key] = item[key];
            });
            this.vm.selectedExamination.selectedClass.selectedSection.studentSubjectList.push(tempItem);
        });
    }

    populateSubjectList(): void {
        this.vm.subjectList = [];
        this.classSubjectList.forEach(item => {
            let tempSubject = {
                'id': item.parentSubject,
                'name': this.getSubjectName(item.parentSubject),
            };
            this.vm.subjectList.push(tempSubject);
        });
    }


    //Create Test
    createTest(): void {

        if (this.vm.selectedSubject === null) {
            alert('Subject should be selected');
            return;
        }

        if (this.vm.selectedDate === null) {
            alert('Date should be selected');
            return;
        }

        if (this.vm.selectedTestType === 0) {
            this.vm.selectedTestType = null;
        }

        if (!this.isOnlyGrade(this.vm.selectedSubject.id)
            && (!this.vm.selectedMaximumMarks || this.vm.selectedMaximumMarks < 1)) {
            alert('Invalid Maximum Marks');
            return;
        }

        if (this.isOnlyGrade(this.vm.selectedSubject.id)) {
            this.vm.selectedMaximumMarks = 100;
        }

        let testAlreadyAdded = false;
        this.vm.selectedExamination.selectedClass.selectedSection.testList.every(item => {
            if (item.parentSubject == this.vm.selectedSubject.id && item.testType == this.vm.selectedTestType) {
                testAlreadyAdded = true;
                return false;
            }
            return true;
        });

        if (testAlreadyAdded) {
            alert('Test Already created for this subject and type');
            return;
        }

        this.vm.isLoading = true;

        let data = {
            'parentExamination': this.vm.selectedExamination.id,
            'parentClass': this.vm.selectedExamination.selectedClass.dbId,
            'parentDivision': this.vm.selectedExamination.selectedClass.selectedSection.id,
            'parentSubject': this.vm.selectedSubject.id,
            'startTime': this.getDateTime(this.vm.selectedDate, this.vm.selectedStartTime),
            'endTime': this.getDateTime(this.vm.selectedDate, this.vm.selectedEndTime),
            'testType': this.vm.selectedTestType,
            'maximumMarks': this.vm.selectedMaximumMarks,
        };

        let student_test_data = this.prepareStudentTestDataToAdd();

        Promise.all([
            this.vm.examinationService.createTest(data, this.vm.user.jwt),
            this.vm.examinationService.createStudentTestList(student_test_data, this.vm.user.jwt),
        ]).then(value => {
            this.addTestToTestList(value[0]);
            this.addStudentTestListToExaminationList(value[1], false);
            this.vm.selectedSubject = null;
            this.vm.selectedTestType = null;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    prepareStudentTestDataToAdd(): any {
        let student_test_list = [];
        this.vm.selectedExamination.selectedClass.selectedSection.studentSubjectList.forEach(item => {
            if (item.parentSubject === this.vm.selectedSubject.id) {
                let tempData = {
                    'parentStudent': item.parentStudent,
                    'parentExamination': this.vm.selectedExamination.id,
                    'parentSubject': item.parentSubject,
                    'testType': this.vm.selectedTestType,
                    'marksObtained': 0,
                };
                student_test_list.push(tempData);
            }
        });
        return student_test_list;
    }

    getDateTime(selectedDate: any, selectedTime: any): any {
        return selectedDate+' '+selectedTime+':00+05:30';
    }

    addTestToTestList(test: any): void {
        let tempTest = {};
        Object.keys(test).forEach(key => {
            tempTest[key] = test[key];
        });
        tempTest['subjectName'] = this.getSubjectName(test.parentSubject) + ((test.testType!=null)?' - '+test.testType:'');
        tempTest['onlyGrade'] = this.isOnlyGrade(test.parentSubject);
        this.vm.selectedExamination.selectedClass.selectedSection.testList.push(tempTest);
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

    isOnlyGrade(subjectId: any): boolean {
        let result = false;
        this.classSubjectList.every(item => {
            if (item.parentSubject === subjectId) {
                if(item.onlyGrade) {
                    result = true;
                }
                return false;
            }
            return true;
        });
        return result;
    }

    //Delete Test
    deleteTest(test: any): void {
        this.vm.isLoading = true;

        let student_test_data = this.prepareStudentTestDataToRemove(test);

        let service_list = [];
        service_list.push(this.vm.examinationService.deleteTest(test.id, this.vm.user.jwt));

        if (student_test_data.length > 0) {
            service_list.push(this.vm.examinationService.deleteStudentTestList(student_test_data, this.vm.user.jwt));
        }

        Promise.all(service_list).then(value => {
            this.removeTestFromTestList(test);
            if (student_test_data.length > 0) {
                this.removeStudentTestFromTestList(test);
            }
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

        /*this.vm.examinationService.deleteTest(test.id, this.vm.user.jwt).then(value => {
            this.removeTestFromTestList(test);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });*/
    }

    prepareStudentTestDataToRemove(test): any {
        let student_test_id_list = [];
        this.vm.selectedExamination.selectedClass.selectedSection.studentTestList.forEach(item => {
            if (item.parentSubject === test.parentSubject &&
                item.testType === test.testType) {
                student_test_id_list.push(item.id);
            }
        });
        return student_test_id_list.join();
    }

    removeTestFromTestList(test: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection.testList =
            this.vm.selectedExamination.selectedClass.selectedSection.testList.filter(item => {
                if (item.id === test.id) {
                    return false;
                }
                return true;
            });
    }

    removeStudentTestFromTestList(test: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection.studentTestList =
            this.vm.selectedExamination.selectedClass.selectedSection.studentTestList.filter(item => {
                if (item.parentSubject === test.parentSubject &&
                    item.testType === test.testType) {
                    return false;
                }
                return true;
            });
    }

    // Update Test
    updateTest(test: any): void {
        alert('Functionality yet to be implemented');
    }

}