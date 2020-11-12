
import {AddStudentRemarksComponent} from './add-student-remarks.component';

export class AddStudentRemarksServiceAdapter {

    vm: AddStudentRemarksComponent;

    constructor() {}

    initializeAdapter(vm: AddStudentRemarksComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {

        this.vm.isInitialLoading = true;

        const attendance_permission_data = {
            'parentEmployee': this.vm.user.activeSchool.employeeId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_permission, attendance_permission_data), // 2
        ]).then(value => {

            this.vm.attendancePermissionList = value[2];

            if (this.vm.attendancePermissionList.length === 0) {
                this.vm.isInitialLoading = false;
                return;
            }

            const request_student_section_data = {
                'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
                'parentDivision__in': Array.from(new Set(this.vm.attendancePermissionList.map(item => {return item.parentDivision}))).join(),
                'parentClass__in': Array.from(new Set(this.vm.attendancePermissionList.map(item => {return item.parentClass}))).join(),
                'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentStudent__parentTransferCertificate': 'null__korangle'
            };

            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data).then(value_studentSection => {

                this.populateStudentSectionList(value_studentSection);

                if (this.vm.studentSectionList.length === 0) {
                    alert('No students have been allocated in your permitted class');
                    this.vm.isInitialLoading = false;
                    return;
                }

                const request_student_data = {
                    'id__in': this.vm.studentSectionList.map(item => {return item.parentStudent}).join(),
                    'fields__korangle': 'id,profileImage,name',
                };


                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data).then(value_student => {

                    this.vm.studentList = value_student;

                    /*this.vm.studentSectionList.forEach(item => {
                        item['student'] = value_student.find(item_student => {
                            return item_student.id === item.parentStudent;
                        });
                    });*/

                    this.vm.isInitialLoading = false;

                }, error => {
                    this.vm.isInitialLoading = false;
                });

            }, error => {
                this.vm.isInitialLoading = false;
            });

            this.populateClassSectionList(value[0], value[1]);

        }, error => {
            this.vm.isInitialLoading = false;
        });

    }

    populateStudentSectionList(studentSectionList: any): void{
        this.vm.studentSectionList = studentSectionList.filter(eachStudentSection => {
            return this.vm.attendancePermissionList.some(eachAttendancePermission => {
                if (eachStudentSection.parentClass === eachAttendancePermission.parentClass
                    && eachStudentSection.parentDivision === eachAttendancePermission.parentDivision) {
                    return true;
                }
                return false;
            });
        });

    }
    populateClassSectionList(classList: any, sectionList: any): void {

        classList.forEach(classs => {
            sectionList.forEach(section => {
                if (this.vm.studentSectionList.find(item => {
                    return item.parentClass === classs.id && item.parentDivision === section.id;
                }) !== undefined) {
                    this.vm.classSectionList.push({
                        'class': classs,
                        'section': section,
                    });
                }
            });
        });

        this.vm.selectedClassSection = this.vm.classSectionList[0];
    }

    getStudentRemarkDetails(): void {

        const student_remark_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__in': this.vm.getFilteredStudentSectionList().map(item => item.parentStudent).join(','),
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.remarks, student_remark_data),
        ]).then(value => {

            this.vm.studentRemarkList = value[0];
            this.vm.isLoading = false;
            this.vm.showStudentList = true;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    updateStudentRemark(studentSection: any, newRemark: any, element: any): void {

        if (this.vm.getStudentRemark(studentSection) !== newRemark) {

            const prev_student_remark = this.vm.studentRemarkList.find(studentRemark => {
                return studentRemark.parentStudent === studentSection.parentStudent;
            });

            const service_list = [];

            if (prev_student_remark) {
                const student_remark_data = {
                    'id': prev_student_remark.id,
                    'parentStudent': prev_student_remark.parentStudent,
                    'parentSession': prev_student_remark.parentSession,
                    'remark': newRemark,
                };
                service_list.push(this.vm.reportCardMpBoardService.updateObject(this.vm.reportCardMpBoardService.student_remark, student_remark_data));
            } else {
                const student_remark_data = {
                    'parentStudent': studentSection.parentStudent,
                    'parentSession': studentSection.parentSession,
                    'remark': newRemark,
                };
                service_list.push(this.vm.reportCardMpBoardService.createObject(this.vm.reportCardMpBoardService.student_remark, student_remark_data));
            }

            element.classList.add('updatingField');

            Promise.all(service_list).then(value => {
                if (prev_student_remark) {
                    this.vm.studentRemarkList.find(studentRemark => {
                        return studentRemark.id === value[0].id;
                    }).remark = value[0].remark;
                } else {
                    this.vm.studentRemarkList.push(value[0]);
                }

                element.classList.remove('updatingField');

            }, error => {
                // Nothing to do here
            })

        }

    }

}
