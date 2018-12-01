
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

        Promise.all([
            this.vm.examinationService.getExaminationList(request_examination_data, this.vm.user.jwt),
            this.vm.classService.getClassList(this.vm.user.jwt),
            this.vm.classService.getSectionList(this.vm.user.jwt),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
        ]).then(value => {
            this.examinationList = value[0];
            this.classList = value[1];
            this.sectionList = value[2];
            this.subjectList = value[3];
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
            this.addTestListToExaminationList(value[0]);
            this.populateSubjectList(value[1]);
            this.vm.selectedSubject = null;
            this.vm.selectedTestType = null;
            this.vm.showTestDetails = true;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading =false;
        });

    }

    addTestListToExaminationList(testList: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection.testList = [];
        testList.forEach(test => {
            this.addTestToTestList(test);
        });
    }

    populateSubjectList(classSubjectList: any): void {
        this.vm.subjectList = [];
        classSubjectList.forEach(item => {
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
        };

        this.vm.examinationService.createTest(data, this.vm.user.jwt).then(value => {
            this.addTestToTestList(value);
            this.vm.selectedSubject = null;
            this.vm.selectedTestType = null;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })

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

    //Delete Test
    deleteTest(test: any): void {
        this.vm.isLoading = true;

        this.vm.examinationService.deleteTest(test.id, this.vm.user.jwt).then(value => {
            this.removeTestFromTestList(test);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
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

}