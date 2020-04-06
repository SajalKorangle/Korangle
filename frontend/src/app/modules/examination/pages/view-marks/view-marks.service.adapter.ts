
import {ViewMarksComponent} from './view-marks.component';

export class ViewMarksServiceAdapter {

    vm: ViewMarksComponent;

    constructor() {}

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

        this.vm.isInitialLoading = true;

        let request_examination_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        let request_student_section_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
        };

        let request_employee_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'dateOfLeaving': 'null__korangle',
        };

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, request_employee_data),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
        ]).then( value => {

            this.populateExaminationList(value[0]);
            this.vm.studentSectionList = value[1];
            this.populateClassSectionList(value[2], value[3]);
            this.vm.employeeList = value[4];
            this.vm.subjectList = value[5];

            this.vm.isInitialLoading = false;

        }, error => {
            this.vm.isInitialLoading = false;
        });

    }

    populateExaminationList(examinationList: any): void {
        this.vm.examinationList = examinationList;
        if (this.vm.examinationList.length > 0) {
            this.vm.selectedExamination = this.vm.examinationList[0];
        }
    }

    populateClassSectionList(classList: any, sectionList: any): void {
        this.vm.classSectionList = [];
        classList.filter(classs => {
            sectionList.filter(section => {
                if (this.vm.studentSectionList.find(studentSection => {
                        return studentSection.parentClass == classs.id
                            && studentSection.parentDivision == section.id;
                    }) != undefined) {
                    this.vm.classSectionList.push({
                        'class': classs,
                        'section': section,
                    });
                }
            });
        });
        if(this.vm.classSectionList.length > 0) {
            this.vm.selectedClassSection = this.vm.classSectionList[0];
        }
    }

    getStudentIdList(): any {
        let id_list = [];
        this.vm.getFilteredStudentSectionList().forEach(item => {
            id_list.push(item.parentStudent);
        });
        return id_list.join(',');
    }

    getStudentTestDetails(): void {

        let request_test_data = {
            'parentExamination': this.vm.selectedExamination.id,
            'parentClass': this.vm.selectedClassSection.class.id,
            'parentDivision': this.vm.selectedClassSection.section.id,
        };

        let request_student_data = {
            'id__in': this.getStudentIdList(),
            'fields__korangle': 'id,name,mobileNumber',
        };

        let request_student_test_data = {
            'parentExamination': this.vm.selectedExamination.id,
            'parentStudent__in': this.getStudentIdList(),
        };

        let request_class_subject_data = {
            'parentClass': this.vm.selectedClassSection.class.id,
            'parentDivision': this.vm.selectedClassSection.section.id,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_test_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data),
            this.vm.examinationService.getObjectList(this.vm.examinationService.student_test, request_student_test_data),
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_data),
        ]).then(value => {

            this.vm.testList = value[0];
            this.vm.studentList = value[1];
            this.vm.studentTestList = value[2];
            this.vm.classSubjectList = value[3];

            this.vm.isLoading = false;
            this.vm.showTestDetails = true;

        }, error => {
            this.vm.isLoading = false;
        })

    }

}