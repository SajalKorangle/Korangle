
import {AddStudentRemarksComponent} from './add-student-remarks.component';

export class AddStudentRemarksServiceAdapter {

    vm: AddStudentRemarksComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;
    studentSectionList: any;


    initializeAdapter(vm: AddStudentRemarksComponent): void {
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
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_permission,attendance_permission_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section,student_section_data),
        ]).then(value => {
            this.classList = value[0];
            this.sectionList = value[1];
            this.vm.attendancePermissionList = value[2];
            this.studentSectionList = value[3];
            this.vm.attendancePermissionList = this.vm.attendancePermissionList.filter(attendancePermission => {
                return attendancePermission.parentSession == this.vm.user.activeSchool.currentWorkingSessionDbId;
            });
            this.populateStudentSectionList();

            let student_data = {
                'id__in': this.vm.studentSectionList.map(a => a.parentStudent).join(','),
                'fields__korangle': 'id,profileImage,name',
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student,student_data),
            ]).then(value2 => {

                this.vm.studentList = value2[0];

                this.vm.isInitialLoading=false;

            }, error => {
                this.vm.isInitialLoading = false;
            });

            this.populateClassSectionList();

        }, error => {
            this.vm.isInitialLoading = false;
        });

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
        }
    }

    getStudentRemarkDetails(): void {

        let student_remark_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__in': this.vm.studentSectionList.filter(studentSection => {
                return studentSection.parentClass == this.vm.selectedClassSection.class.id
                    && studentSection.parentDivision == this.vm.selectedClassSection.section.id;
            }).map(item => item.parentStudent).join(','),
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.student_remark,student_remark_data),
        ]).then(value => {

            this.vm.studentRemarkList = value[0];

            this.vm.isLoading = false;
            this.vm.showStudentList = true;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    updateStudentRemark(studentSection: any, newRemark: any, element: any): void {

        if (this.vm.getStudentRemark(studentSection) != newRemark) {

            let prev_student_remark = this.vm.studentRemarkList.find(studentRemark => {
                return studentRemark.parentStudent == studentSection.parentStudent;
            });

            let service_list = [];

            if (prev_student_remark) {
                let student_remark_data = {
                    'id': prev_student_remark.id,
                    'parentStudent': prev_student_remark.parentStudent,
                    'parentSession': prev_student_remark.parentSession,
                    'remark': newRemark,
                };
                service_list.push(this.vm.reportCardCbseService.updateObject(this.vm.reportCardCbseService.student_remark,student_remark_data));
            } else {
                let student_remark_data = {
                    'parentStudent': studentSection.parentStudent,
                    'parentSession': studentSection.parentSession,
                    'remark': newRemark,
                };
                service_list.push(this.vm.reportCardCbseService.createObject(this.vm.reportCardCbseService.student_remark,student_remark_data));
            }

            element.classList.add('updatingField');

            Promise.all(service_list).then(value => {

                if(prev_student_remark) {
                    this.vm.studentRemarkList.find(studentRemark => {
                        return studentRemark.id == value[0].id;
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