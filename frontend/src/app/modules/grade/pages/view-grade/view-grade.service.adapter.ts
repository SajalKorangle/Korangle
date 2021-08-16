import { ViewGradeComponent } from './view-grade.component';
import {CommonFunctions} from '@modules/common/common-functions';

export class ViewGradeServiceAdapter {
    vm: ViewGradeComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ViewGradeComponent): void {
        this.vm = vm;
    }

    // initialize data
    async initializeData() {
        this.vm.isInitialLoading = true;

        const routeInformation = CommonFunctions.getModuleTaskPaths();
        const in_page_permission_request = {
            parentTask__parentModule__path: routeInformation.modulePath,
            parentTask__path: routeInformation.taskPath,
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };

         this.vm.inPagePermissionMappedByKey = (await
             this.vm.employeeService.getObject(this.vm.employeeService.employee_permissions, in_page_permission_request)).configJSON;

        let grade_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let sub_grade_data = {
            parentGrade__parentSchool: this.vm.user.activeSchool.dbId,
        };

        let examination_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentExamination: this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentTransferCertificate: 'null__korangle',
        };

        const attendance_permission_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        if (!this.vm.hasAdminPermission()) {
            const attendance_perm_list = await this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_permission,
                attendance_permission_data);
            request_student_section_data['parentClass__in'] = attendance_perm_list.map(permission => permission.parentClass).join();
            request_student_section_data['parentDivision__in'] = attendance_perm_list.map(permission => permission.parentClass).join();
        }

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //1
            this.vm.gradeService.getObjectList(this.vm.gradeService.grade, grade_data), //2
            this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grade, sub_grade_data), //3
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, examination_data), //4
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data) //5
        ]).then(
            (value) => {
                this.vm.classList = value[0];
                this.vm.sectionList = value[1];
                this.vm.examinationList = value[4];
                let value_studentSection = value[5];
                let student_studentSection_map = {};

                if (value_studentSection.length == 0) {
                    this.vm.isInitialLoading = false;
                    return;
                }

                let student_id = [];
                value_studentSection.forEach((item) => {
                    student_studentSection_map[item.parentStudent] = item;
                    student_id.push(item.parentStudent);
                });

                let request_student_data = {
                    id__in: student_id.join(),
                    fields__korangle: 'id,name,profileImage',
                };

                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data).then(
                    (value_student) => {
                        // map student with student section
                        this.vm.studentList = value_student.map((student) => {
                            student['studentSection'] = student_studentSection_map[student.id];
                            return student;
                        });
                        this.vm.isInitialLoading = false;
                    },
                    (error) => {
                        console.log('Error fetching students');
                    }
                );
                this.populateFilteredClassSectionList(value_studentSection);
                this.populateGradeList(value[2], value[3]);
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    populateFilteredClassSectionList(value_studentSection: any): void {
        this.vm.filteredClassSectionList = [];
        this.vm.classList.forEach((classs) => {
            this.vm.sectionList.forEach((section) => {
                if (
                    value_studentSection.find(
                        (student_section) => student_section.parentClass === classs.id && student_section.parentDivision === section.id
                    ) !== undefined
                ) {
                    this.vm.filteredClassSectionList.push({
                        class: classs,
                        section: section,
                    });
                }
            });
        });
    }

    // To be discussed with sir regarding hardcoding of subGradeList
    populateGradeList(gradeList: any, subGradeList: any): any {
        this.vm.gradeList = gradeList;
        this.vm.gradeList.forEach((grade) => {
            grade['subGradeList'] = [];
            subGradeList.forEach((subGrade) => {
                if (subGrade.parentGrade === grade.id) {
                    grade['subGradeList'].push(subGrade);
                }
            });
        });
    }

    // Get Student Sub-Grade Details
    getStudentSubGradeDetails(): void {
        let studentList = this.vm.getFilteredStudentList();

        if (studentList.length > 0) {
            this.vm.isLoading = true;

            let request_student_sub_grade_data = {
                parentStudent__in: this.vm.studentList.map((item) => item.id).join(),
                parentSubGrade__parentGrade: this.vm.selectedGrade.id,
                parentExamination: this.vm.selectedExamination.id,
            };
            this.vm.gradeService.getObjectList(this.vm.gradeService.student_sub_grade, request_student_sub_grade_data).then(
                (value2) => {
                    this.populateStudentList(value2);
                    this.vm.showTestDetails = true;
                    this.vm.isLoading = false;
                },
                (error) => {
                    this.vm.isLoading = false;
                }
            );
        } else {
            this.vm.showTestDetails = true;
            this.vm.isLoading = false;
        }
    }

    populateStudentList(student_sub_grade_list: any): void {
        this.vm.getFilteredStudentList().forEach((item) => {
            item['subGradeList'] = [];

            this.vm.selectedGrade.subGradeList.forEach((subGrade) => {
                let result = this.getStudentSubGrade(item, subGrade, student_sub_grade_list);
                if (result) {
                    item['subGradeList'].push(result);
                } else {
                    result = {
                        id: 0,
                        parentStudent: item.id,
                        parentSubGrade: subGrade.id,
                        parentExamination: this.vm.selectedExamination,
                        gradeObtained: '',
                    };
                    item['subGradeList'].push(result);
                }
            });
        });

        this.vm.studentList.sort(function (obj1, obj2) {
            if (obj1.studentSection.rollNumber < obj2.studentSection.rollNumber) return -1;
            if (obj1.studentSection.rollNumber > obj2.studentSection.rollNumber) return 1;
            if (obj1.name <= obj2.name) return -1;
            return 1;
        });
    }

    getStudentSubGrade(student: any, subGrade: any, student_sub_grade_list: any): any {
        let result = null;
        student_sub_grade_list.every((item) => {
            if (item.parentStudent === student.id && item.parentSubGrade === subGrade.id) {
                result = item;
                return false;
            }
            return true;
        });
        return result;
    }
}
