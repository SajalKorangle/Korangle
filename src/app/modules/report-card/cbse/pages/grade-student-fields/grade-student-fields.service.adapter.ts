
import {GradeStudentFieldsComponent} from './grade-student-fields.component';

export class GradeStudentFieldsServiceAdapter {

    vm: GradeStudentFieldsComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;
    studentSectionList: any;


    /*examinationList: any;
    classList: any;
    sectionList: any;
    fieldList: any;
    subFieldList: any;
    permissionList: any;

    studentList: any;*/

    initializeAdapter(vm: GradeStudentFieldsComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        this.vm.isInitialLoading = true;

        let attendance_permission_data = {
            'parentEmployee': this.vm.user.activeSchool.employeeId,
        };

        let student_section_data = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.extra_field, {}),
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.term, {}),
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_permission,attendance_permission_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section,student_section_data),
            // this.vm.employeeService.getObjectList(this.vm.employeeService.)
        ]).then(value => {

            console.log(value);

            this.classList = value[0];
            this.sectionList = value[1];
            this.vm.extraFieldList = value[2];
            this.vm.termList = value[3];
            this.vm.attendancePermissionList = value[4];
            this.studentSectionList = value[5];

            this.populateStudentSectionList();

            let student_data = {
                'id__in': this.vm.studentSectionList.map(a => a.parentStudent).join(','),
                'fields__korangle': 'id,profileImage,name',
            };

            let student_extra_field_data = {
                'parentStudent__in': this.vm.studentSectionList.map(a => a.parentStudent).join(','),
                'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student,student_data),
                this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.student_extra_field,student_extra_field_data),
            ]).then(value2 => {

                console.log(value2);

                this.vm.studentList = value2[0];
                this.vm.studentExtraFieldList = value2[1];

                this.vm.isInitialLoading=false;

            }, error => {
                this.vm.isInitialLoading = false;
            });

            this.populateSelectedExtraField();

            this.populateClassSectionList();

        }, error => {
            this.vm.isInitialLoading = false;
        });

    }

    populateSelectedExtraField(): void {
        this.vm.selectedExtraField = this.vm.extraFieldList[0];
    }

    populateStudentSectionList(): void {

        if (this.vm.attendancePermissionList.length > 0) {
            this.vm.studentSectionList = this.studentSectionList.filter(studentSection => {
                return this.vm.attendancePermissionList.find(attendancePermission => {
                    return attendancePermission.parentClass == studentSection.parentClass
                        && attendancePermission.parentDivision == studentSection.parentDivision;
                }) != undefined;
            });
        } else {
            this.vm.studentSectionList = this.studentSectionList;
        }

    }

    populateClassSectionList(): void {
        if (this.vm.attendancePermissionList.length > 0) {
            this.classList.filter(classs => {
                return this.vm.attendancePermissionList.find(attendancePermission => {
                    return attendancePermission.parentClass == classs.id;
                }) != undefined;
            }).forEach(classs => {
                this.sectionList.filter(section => {
                    return this.vm.attendancePermissionList.find(attendancePermission => {
                        return attendancePermission.parentClass == classs.id
                            && attendancePermission.parentDivision == section.id;
                    }) != undefined;
                }).forEach(section => {
                    this.vm.classSectionList.push({
                        'class': classs,
                        'section': section,
                    });
                });
            });
        } else {
            this.classList.forEach(classs => {
                this.sectionList.filter(section => {
                    return this.vm.studentSectionList.find(studentSection => {
                        return studentSection.parentClass == classs.id
                            && studentSection.parentDivision == section.id;
                    }) !=  undefined;
                }).forEach(section => {
                    this.vm.classSectionList.push({
                        'class': classs,
                        'section': section,
                    });
                });
            });
        }
        if (this.vm.classSectionList.length > 0) {
            this.vm.selectedClassSection = this.vm.classSectionList[0];
            if (this.vm.selectedClassSection.class.orderNumber >= 5) {
                this.vm.selectedTerm = this.vm.termList[0];
            } else {
                this.vm.selectedTerm = this.vm.termList[2];
            }
        }
    }

    getStudentFieldDetails(): void {

        let student_extra_field_data = {
            'parentTerm': this.vm.selectedTerm.id,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentExtraField': this.vm.selectedExtraField.id,
            'parentStudent': this.vm.studentSectionList.filter(studentSection => {
                return studentSection.parentClass == this.vm.selectedClassSection.class.id
                    && studentSection.parentDivision == this.vm.selectedClassSection.section.id;
            }).map(item => item.parentStudent).join(','),
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.student_extra_field,student_extra_field_data),
        ]).then(value => {

            console.log(value[0]);

            this.vm.studentExtraFieldList = value[0];

            this.vm.isLoading = false;
            this.vm.showStudentList = true;
        }, error => {
            this.vm.isLoading = false;
        });

    }

}