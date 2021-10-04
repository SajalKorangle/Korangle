import { GradeStudentComponent } from './grade-student.component';
import {CommonFunctions} from '@modules/common/common-functions';

export class GradeStudentServiceAdapter {
    vm: GradeStudentComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: GradeStudentComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {
        this.vm.isInitialLoading = true;
        // ------------------- Start of Fetching and storing inPagePermission (Admin or User) of this page  ---------------------
        const routeInformation = CommonFunctions.getModuleTaskPaths();
        const in_page_permission_request = {
            parentTask__parentModule__path: routeInformation.modulePath,
            parentTask__path: routeInformation.taskPath,
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };

         this.vm.inPagePermissionMappedByKey = (await
             this.vm.employeeService.getObject(this.vm.employeeService.employee_permissions, in_page_permission_request)).configJSON;
        // ------------------- End of Fetching and storing inPagePermission (Admin or User) of this page  ---------------------

        // ------------------- Start of Fetching and storing required Data (permittedClasses,gradeD,subGrad,examination)  ---------------------
        let attendance_permission_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let grade_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let sub_grade_data = {
            parentGrade__parentSchool: this.vm.user.activeSchool.dbId,
        };

        let request_examination_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_permission, attendance_permission_data),
            this.vm.gradeService.getObjectList(this.vm.gradeService.grade, grade_data),
            this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grade, sub_grade_data),
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
        ]).then(
            (value) => {
                this.vm.classList = value[0];
                this.vm.sectionList = value[1];
                this.vm.attendancePermissionList = value[2];
                this.vm.examinationList = value[5];

                if (!this.vm.hasAdminPermission() && this.vm.attendancePermissionList.length === 0) {
                    this.vm.isInitialLoading = false;
                    return;
                }
        // ------------------- End of Fetching and storing required Data (permittedClasses,gradeD,subGrad,examination)  ---------------------

        // ------------------- Start of Fetching and storing Student and Student Section Data ---------------------

                const request_student_section_data = {
                    parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                    parentDivision__in: Array.from(
                        new Set(
                            this.vm.attendancePermissionList.map((item) => {
                                return item.parentDivision;
                            })
                        )
                    ).join(),
                    parentClass__in: Array.from(
                        new Set(
                            this.vm.attendancePermissionList.map((item) => {
                                return item.parentClass;
                            })
                        )
                    ).join(),
                    parentSession: this.vm.user.activeSchool.currentSessionDbId,
                    parentStudent__parentTransferCertificate: 'null__korangle',
                };

                if (this.vm.hasAdminPermission()) {
                    request_student_section_data['parentClass__in'] = value[0].map(classs => classs.id).join();
                    request_student_section_data['parentDivision__in'] = value[1].map(div => div.id).join();
                }

                const student_studentSection_map = {};
                this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data).then(
                    (value_studentSection) => {

                        // If the user has adminPermission Not needed to check the attendancePermissionList,
                        // else filter only the permittedStudentSection using attendancePermissionList
                        value_studentSection = this.vm.hasAdminPermission() ? value_studentSection : value_studentSection.filter((eachStudentSection) => {
                            return this.vm.attendancePermissionList.some((eachAttendancePermission) => {
                                return eachStudentSection.parentClass === eachAttendancePermission.parentClass &&
                                    eachStudentSection.parentDivision === eachAttendancePermission.parentDivision;

                            });
                        });

                        if (value_studentSection.length === 0) {
                            this.vm.isInitialLoading = false;
                            // alert('No students have been allocated');
                            return;
                        }
                        this.populateFilteredClassSectionList(value_studentSection);

                        const student_id = [];
                        value_studentSection.forEach((item) => {
                            student_studentSection_map[item.parentStudent] = item;
                            student_id.push(item.parentStudent);
                        });

                        const request_student_data = {
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
                                // ------------------- End of Fetching and storing Student and Student Section Data ---------------------
                                this.vm.isInitialLoading = false;
                            },
                            (error) => {
                                console.log('Error fetching students');
                            }
                        );
                    },
                    (error) => {
                        console.log('Error fetching student section data');
                    }
                );
                //Populating the GradeList
                this.populateGradeList(value[3], value[4]);
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    populateFilteredClassSectionList(student_section_list): void {
        this.vm.filteredClassSectionList = [];
        this.vm.classList.forEach((classs) => {
            this.vm.sectionList.forEach((section) => {
                let any_student = student_section_list.find((studentSection) => studentSection.parentClass == classs.id &&
                    studentSection.parentDivision == section.id);
                if (any_student) {
                    // checking if any student is present in the class and section then pushing
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
        // console.log(this.vm.gradeList);
        // this.vm.selectedGrade = this.vm.gradeList[0];
    }
     // End of Fetching and populating the Student,Permitted Classes,grade details

    // Get Student Sub-Grade Details
    getStudentSubGradeDetails(): void {
        this.vm.isLoading = true;

        const request_student_sub_grade_data = {
            parentStudent__in: this.vm
                .getFilteredStudentList()
                .map((item) => item.id)
                .join(),
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
                        parentExamination: this.vm.selectedExamination.id,
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

    updateStudentField(studentSubGrade, element) {
        let current_value = element.target.value;

        if (current_value === studentSubGrade.gradeObtained) return;

        document.getElementById(studentSubGrade.parentStudent + '_' + studentSubGrade.parentSubGrade).classList.add('updatingField');

        if (current_value == null || current_value == undefined) {
            current_value = '';
            return;
            // alert("Enter a valid value");
        }
        // studentSubField.gradeObtained = parseFloat(current_value.toString()).toFixed(2);
        studentSubGrade.gradeObtained = current_value;

        let service_list = [];
        if (studentSubGrade.id == 0) {
            let request_studentSubGrade_data = {
                parentStudent: studentSubGrade.parentStudent,
                parentSubGrade: studentSubGrade.parentSubGrade,
                parentExamination: studentSubGrade.parentExamination,
                gradeObtained: studentSubGrade.gradeObtained,
            };
            service_list.push(this.vm.gradeService.createObject(this.vm.gradeService.student_sub_grade, request_studentSubGrade_data));
        } else {
            service_list.push(this.vm.gradeService.updateObject(this.vm.gradeService.student_sub_grade, studentSubGrade));
        }
        Promise.all(service_list).then(
            (value) => {
                let item = this.vm.studentList
                    .find((student) => {
                        return student.id == studentSubGrade.parentStudent;
                    })
                    ['subGradeList'].find((subGrade) => {
                        return subGrade.parentSubGrade == studentSubGrade.parentSubGrade;
                    });
                item.id = value[0].id;
                item.gradeObtained = value[0].gradeObtained;

                document
                    .getElementById(studentSubGrade.parentStudent + '_' + studentSubGrade.parentSubGrade)
                    .classList.remove('updatingField');
            },
            (error) => {
                alert('Error updating marks');
            }
        );
    }
}
