
import { ViewMarksComponent } from './view-marks.component';

export class ViewMarksServiceAdapter {

    vm: ViewMarksComponent;

    constructor() {}

    // Data
    subjectList: any;
    examinationList: any;
    classSubjectList: any;
    studentSubjectList: any;
    classTestList: any;
    studentTestList: any;

    student_full_profile: any;


    initializeAdapter(vm: ViewMarksComponent): void {
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
        this.vm.isLoading = true;

        let request_examination_data = {
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
            'schoolId': this.vm.user.activeSchool.dbId,
        };

        const request_student_data = {
            studentDbId: this.vm.user.section.student.id,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.examinationService.getExaminationList(request_examination_data, this.vm.user.jwt),
            this.vm.studentService.getStudentFullProfile(request_student_data, this.vm.user.jwt),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
        ]).then(value => {

            this.examinationList = value[0];
            this.vm.examinationList = this.examinationList;

            this.student_full_profile = value[1];
            this.subjectList = value[2];

            this.vm.selectedStudent = value[1];

            if (this.examinationList.length === 0) {
                this.vm.isLoading = false;
                return;
            }

            let request_class_subject_data = {
                'subjectList': [],
                'schoolList': [this.vm.user.activeSchool.dbId],
                'employeeList': [],
                'classList': [this.student_full_profile.classDbId],
                'sectionList': [this.student_full_profile.sectionDbId],
                'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
                'mainSubject': [],
                'onlyGrade': [],
            };

            let request_student_subject_data = {
                'studentList': [this.student_full_profile.dbId],
                'subjectList': [],
                'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
            };

            let request_class_test_data = {
                'examinationList': this.getExaminationIdList(),
                'subjectList': [],
                'classList': [this.student_full_profile.classDbId],
                'sectionList': [this.student_full_profile.sectionDbId],
                'startTimeList': [],
                'endTimeList': [],
                'testTypeList': [],
                'maximumMarksList': [],
            };

            let request_student_test_data = {
                'studentList': [this.student_full_profile.dbId],
                'subjectList': [],
                'examinationList': this.getExaminationIdList(),
                'testTypeList': [],
                'marksObtainedList': [],
            };

            console.log('okay');

            Promise.all([
                this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
                this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt),
                this.vm.examinationService.getTestList(request_class_test_data, this.vm.user.jwt),
                this.vm.examinationService.getStudentTestList(request_student_test_data, this.vm.user.jwt),
            ]).then(value2 => {

                this.classSubjectList = value2[0];
                this.studentSubjectList = value2[1];
                this.classTestList = value2[2];
                this.studentTestList = value2[3];

                this.populateStudentMarksList();

                this.vm.isLoading = false;

            }, error => {
                this.vm.isLoading = false;
            });

        }, error => {
            this.vm.isLoading = false;
        });

    }

    getExaminationIdList(): any {
        let id_list = [];
        this.examinationList.forEach(item => {
            id_list.push(item.id);
        });
        return id_list;
    }

    populateStudentMarksList(): void {

        this.vm.examinationList.forEach(examination => {

            examination['marksList'] = [];

            this.studentTestList.forEach(item => {
                if (item.parentExamination === examination.id) {
                    if (this.isSubjectInClassSubjectList(item.parentSubject)
                        && this.isSubjectInStudentSubjectList(item.parentSubject)
                        && this.isTestInClassTestList(item.parentSubject, item.testType, examination.id)) {

                        let tempItem = {};

                        tempItem = this.copyObject(item);
                        tempItem['subjectName'] = this.getSubjectName(item.parentSubject);
                        tempItem['maximumMarks'] = this.getMaximumMarks(item.parentExamination, item.parentSubject, item.testType);

                        examination['marksList'].push(tempItem);

                    }
                }

            });

        });

        if (this.vm.examinationList.length > 0) {
            this.vm.selectedExamination = this.vm.examinationList[0];
        }

    }

    isSubjectInClassSubjectList(subjectId: any): boolean {
        let result = false;
        this.classSubjectList.every(item => {
            if (item.parentSubject === subjectId) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    isSubjectInStudentSubjectList(subjectId: any): boolean {
        let result = false;
        this.studentSubjectList.every(item => {
            if (item.parentSubject === subjectId) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    isTestInClassTestList(subjectId: any, testType: any, examinationId: any): boolean {
        let result = false;
        this.classTestList.every(item => {
            if (item.parentSubject === subjectId
                && item.testType == testType
                && item.parentExamination === examinationId) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    getSubjectName(subjectId: any): any {
        let result = '';
        this.subjectList.every(item => {
            if (item.id === subjectId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getMaximumMarks(examId: any, subjectId: any, testType: any): any {
        let result = 100;
        this.classTestList.every(item => {
            if (item.parentExamination === examId
                && item.parentSubject === subjectId
                && item.testType === testType) {
                result = item.maximumMarks;
                return false;
            }
            return true;
        });
        return result;
    }

}
