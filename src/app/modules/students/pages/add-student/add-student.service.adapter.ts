
import { AddStudentComponent } from './add-student.component';
import { ATTENDANCE_STATUS_LIST } from '../../../attendance/classes/constants';
import {Student} from '../../../../classes/student';

export class AddStudentServiceAdapter {

    vm: AddStudentComponent;

    constructor() {}

    // Data
    classSubjectList: any;
    classTestList: any;


    initializeAdapter(vm: AddStudentComponent): void {
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
            'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
        };

        let request_examination_data = {
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
            schoolId: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
            this.vm.examinationService.getExaminationList(request_examination_data, this.vm.user.jwt),
        ]).then(value => {

            let request_class_test_data = {
                'examinationList': value[1].map(a => a.id),
            };

            this.vm.examinationService.getTestList(request_class_test_data, this.vm.user.jwt).then(value2 => {

                this.classSubjectList = value[0];
                this.classTestList = value2;
                this.vm.isLoading = false;

            }, error => {
                this.vm.isLoading = false;
            });

        }, error => {
            this.vm.isLoading = false;
        });

    }

    // Add Student Subjects and test
    addStudentSubjectsAndTests(studentId: any, classId: any, sectionId: any): void {

        let add_student_subject_list = [];

        this.classSubjectList.filter(item => {
            if (item.parentClass == classId && item.parentDivision == sectionId) {
                return true;
            }
            return false;
        }).forEach(item => {
            add_student_subject_list.push({
                'parentStudent': studentId,
                'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentSubject': item.parentSubject,
            });
        });

        let add_student_test_list = [];

        this.classTestList.filter(item => {
            if (item.parentClass == classId && item.parentDivision == sectionId) {
                return true;
            }
            return false;
        }).forEach(item => {
            add_student_test_list.push({
                'parentExamination': item.parentExamination,
                'parentSubject': item.parentSubject,
                'parentStudent': studentId,
                'testType': item.testType,
                'marksObtained': 0,
            });
        });

        Promise.all([
            this.vm.subjectService.createStudentSubjectList(add_student_subject_list, this.vm.user.jwt),
            this.vm.examinationService.createStudentTestList(add_student_test_list, this.vm.user.jwt),
        ]).then (value => {

            alert('Student Profile created successfully');

            this.vm.newStudent = new Student();
            this.vm.newStudent.dateOfBirth = this.vm.todaysDate();

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
            alert('Server Error: Contact admin');
        });

    }

}
