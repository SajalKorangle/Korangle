import { AddStudentRemarksComponent } from './add-student-remarks.component';
import {CommonFunctions} from '@modules/common/common-functions';

export class AddStudentRemarksServiceAdapter {
    vm: AddStudentRemarksComponent;

    constructor() {}

    initializeAdapter(vm: AddStudentRemarksComponent): void {
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

        const attendance_permission_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const examination_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_permission, attendance_permission_data), // 2
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, examination_data), // 3
        ]).then(
            (value) => {
                this.vm.attendancePermissionList = value[2];
                this.populateExaminationList(value[3]);

                if (this.vm.attendancePermissionList.length === 0) {
                    this.vm.isInitialLoading = false;
                    return;
                }

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
                    request_student_section_data.parentClass__in = value[0].map(classs => classs.id).join();
                    request_student_section_data.parentDivision__in = value[1].map(div => div.id).join();
                }

                this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data).then(
                    (value_studentSection) => {
                        this.populateStudentSectionList(value_studentSection);

                        if (this.vm.studentSectionList.length === 0) {
                            alert('No students have been allocated in your permitted class');
                            this.vm.isInitialLoading = false;
                            return;
                        }

                        const request_student_data = {
                            id__in: this.vm.studentSectionList
                                .map((item) => {
                                    return item.parentStudent;
                                })
                                .join(),
                            fields__korangle: 'id,profileImage,name',
                        };

                        this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data).then(
                            (value_student) => {
                                this.vm.studentList = value_student;

                                this.vm.studentSectionList.forEach((item) => {
                                    item['student'] = value_student.find((item_student) => {
                                        return item_student.id === item.parentStudent;
                                    });
                                });

                                this.vm.isInitialLoading = false;
                            },
                            (error) => {
                                this.vm.isInitialLoading = false;
                            }
                        );

                        // Note: this function should be called after student section list has been populated
                        // as it will only populate those classes for which students are present in the session.
                        // or permission has been given to employee.
                        this.populateClassSectionList(value[0], value[1]);
                    },
                    (error) => {
                        this.vm.isInitialLoading = false;
                    }
                );
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    populateExaminationList(examinationList: any): void {
        this.vm.examinationList = examinationList;
        if (examinationList.length > 0) {
            this.vm.htmlAdapter.selectedExamination = this.vm.examinationList[0];
        }
    }

    populateStudentSectionList(studentSectionList: any): void {
        this.vm.studentSectionList = studentSectionList.filter((eachStudentSection) => {
            return this.vm.attendancePermissionList.some((eachAttendancePermission) => {
                if (
                    eachStudentSection.parentClass === eachAttendancePermission.parentClass &&
                    eachStudentSection.parentDivision === eachAttendancePermission.parentDivision
                ) {
                    return true;
                }
                return false;
            });
        });
    }

    populateClassSectionList(classList: any, sectionList: any): void {
        classList.forEach((classs) => {
            sectionList.forEach((section) => {
                if (
                    this.vm.studentSectionList.find((item) => {
                        return item.parentClass === classs.id && item.parentDivision === section.id;
                    }) !== undefined
                ) {
                    this.vm.classSectionList.push({
                        class: classs,
                        section: section,
                    });
                }
            });
        });

        if (this.vm.classSectionList.length > 0) {
            this.vm.htmlAdapter.handleClassSectionSelection(this.vm.classSectionList[0]);
        }
    }

    getStudentRemarkDetails(): void {
        const student_remark_data = {
            parentExamination: this.vm.htmlAdapter.selectedExamination.id,
            parentStudent__in: this.vm.htmlAdapter.filteredSortedStudentSectionList.map((item) => item.parentStudent).join(','),
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.student_examination_remarks, student_remark_data),
        ]).then(
            (value) => {
                this.vm.studentRemarkList = value[0];
                this.vm.isLoading = false;
                this.vm.htmlAdapter.showStudentList = true;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    updateStudentRemark(studentSection: any, newRemark: any, element: any): void {
        if (this.vm.htmlAdapter.getStudentRemark(studentSection) !== newRemark) {
            const prev_student_remark = this.vm.studentRemarkList.find((studentRemark) => {
                return studentRemark.parentStudent === studentSection.parentStudent;
            });

            const service_list = [];

            if (prev_student_remark) {
                const student_remark_data = {
                    id: prev_student_remark.id,
                    parentStudent: prev_student_remark.parentStudent,
                    parentExamination: this.vm.htmlAdapter.selectedExamination.id,
                    remark: newRemark,
                };
                service_list.push(
                    this.vm.examinationService.updateObject(this.vm.examinationService.student_examination_remarks, student_remark_data)
                );
            } else {
                const student_remark_data = {
                    parentStudent: studentSection.parentStudent,
                    parentExamination: this.vm.htmlAdapter.selectedExamination.id,
                    remark: newRemark,
                };
                service_list.push(
                    this.vm.examinationService.createObject(this.vm.examinationService.student_examination_remarks, student_remark_data)
                );
            }

            element.classList.add('updatingField');

            Promise.all(service_list).then(
                (value) => {
                    if (prev_student_remark) {
                        this.vm.studentRemarkList.find((studentRemark) => {
                            return studentRemark.id === value[0].id;
                        }).remark = value[0].remark;
                    } else {
                        this.vm.studentRemarkList.push(value[0]);
                    }

                    element.classList.remove('updatingField');
                },
                (error) => {
                    // Nothing to do here
                }
            );
        }
    }
}
