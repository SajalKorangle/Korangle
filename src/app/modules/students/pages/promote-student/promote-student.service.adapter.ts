
import { PromoteStudentComponent } from './promote-student.component';
import { ATTENDANCE_STATUS_LIST } from '../../../attendance/classes/constants';
import {Student} from '../../../../classes/student';

export class PromoteStudentServiceAdapter {

    vm: PromoteStudentComponent;

    constructor() {}

    // Data
    classSubjectList: any;
    classTestList: any;


    initializeAdapter(vm: PromoteStudentComponent): void {
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

        let request_class_subject_data = {
            'schoolList': [this.vm.user.activeSchool.dbId],
            'sessionList': [this.vm.user.activeSchool.currentSessionDbId+1],
        };

        let request_examination_data = {
            sessionId: this.vm.user.activeSchool.currentSessionDbId+1,
            schoolId: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
            this.vm.examinationService.getExaminationList(request_examination_data, this.vm.user.jwt),
        ]).then(value => {

            this.classSubjectList = value[0];

            if (value[1].length > 0) {
                let request_class_test_data = {
                    'examinationList': value[1].map(a => a.id),
                };

                this.vm.examinationService.getTestList(request_class_test_data, this.vm.user.jwt).then(value2 => {

                    this.classTestList = value2;
                    this.vm.isLoading = false;

                }, error => {
                    this.vm.isLoading = false;
                });
            } else {
                this.classTestList = [];
                this.vm.isLoading = false;
            }

        }, error => {
            this.vm.isLoading = false;
        });

    }

    // Add Student Subjects and test
    addStudentSubjectsAndTests(data: any): void {

        let add_student_subject_list = [];

        data.studentList.forEach(student => {
            this.classSubjectList.filter(item => {
                if (item.parentClass == data.classDbId && item.parentDivision == data.sectionDbId) {
                    return true;
                }
                return false;
            }).forEach(item => {
                add_student_subject_list.push({
                    'parentStudent': student.dbId,
                    'parentSession': this.vm.user.activeSchool.currentSessionDbId+1,
                    'parentSubject': item.parentSubject,
                });
            });
        });

        let add_student_test_list = [];

        data.studentList.forEach(student => {
            this.classTestList.filter(item => {
                if (item.parentClass == data.classDbId && item.parentDivision == data.sectionDbId) {
                    return true;
                }
                return false;
            }).forEach(item => {
                add_student_test_list.push({
                    'parentExamination': item.parentExamination,
                    'parentSubject': item.parentSubject,
                    'parentStudent': student.dbId,
                    'testType': item.testType,
                    'marksObtained': 0,
                });
            });
        });

        Promise.all([
            this.vm.subjectService.createStudentSubjectList(add_student_subject_list, this.vm.user.jwt),
            this.vm.examinationService.createStudentTestList(add_student_test_list, this.vm.user.jwt),
        ]).then (value => {

            alert('Students Promoted Successfully');

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
            alert('Server Error: Contact admin');
        });

    }

}
