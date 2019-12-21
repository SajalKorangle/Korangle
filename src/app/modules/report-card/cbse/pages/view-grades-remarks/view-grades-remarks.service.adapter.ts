
import {ViewGradesRemarksComponent} from './view-grades-remarks.component';

export class ViewGradesRemarksServiceAdapter {

    vm: ViewGradesRemarksComponent;

    // Data
    classList: any;
    sectionList: any;
    studentSectionList: any;

    constructor() {}


    initializeAdapter(vm: ViewGradesRemarksComponent): void {
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
            // Fetching the extra fields and the terms
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.extra_field, {}),
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.term, {}),
        ]).then(value => {
            // console.log(value);
            this.classList = value[0];
            this.sectionList = value[1];
            this.vm.attendancePermissionList = value[2];
            this.studentSectionList = value[3];
            this.vm.studentSectionList = this.studentSectionList;
            this.vm.extraFieldList = value[4];
            this.vm.termList = value[5];
            // this.populateStudentSectionList();
            console.log(this.vm.extraFieldList);

            let student_data = {
                'id__in': this.vm.studentSectionList.map(a => a.parentStudent).join(','),
                'fields__korangle': 'id,profileImage,name',
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student,student_data),
            ]).then(value2 => {
                // console.log(value2);
                this.vm.studentList = value2[0];

                this.vm.isInitialLoading=false;

            }, error => {
                this.vm.isInitialLoading = false;
            });
            this.populateClassSectionList();
            this.populateSelectedExtraField();
            // this.getStudentRemarkDetails();

        }, error => {
            this.vm.isInitialLoading = false;
        });

    }
    // populateStudentSectionList(): void {
    //
    //     if (this.vm.attendancePermissionList.length > 0) {
    //         this.vm.studentSectionList = this.studentSectionList.filter(studentSection => {
    //             return this.vm.attendancePermissionList.find(attendancePermission => {
    //                 return attendancePermission.parentClass == studentSection.parentClass
    //                     && attendancePermission.parentDivision == studentSection.parentDivision;
    //             }) != undefined;
    //         });
    //     } else {
    //         this.vm.studentSectionList = this.studentSectionList;
    //     }
    //
    // }

    populateSelectedExtraField(): void{
        this.vm.selectedExtraField = this.vm.extraFieldList[0];
    }

    populateClassSectionList(): void {
        this.vm.classSectionList = [];
        this.classList.filter(classs => {
            this.sectionList.filter(section => {
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
        if (this.vm.classSectionList.length > 0) {
            this.vm.selectedClassSection = this.vm.classSectionList[0];
            if (this.vm.selectedClassSection.class.orderNumber >= 5) {
                this.vm.selectedTerm = this.vm.termList[0];
            } else {
                this.vm.selectedTerm = this.vm.termList[2];
            }
        }
    }

    getStudentFieldRemarkDetails(): void {
        this.vm.studentExtraFieldList = [];
        const promise_arr = [];
        const student_remark_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__in': this.vm.studentSectionList.filter(studentSection => {
                return studentSection.parentClass == this.vm.selectedClassSection.class.id
                    && studentSection.parentDivision == this.vm.selectedClassSection.section.id;
            }).map(item => item.parentStudent).join(','),
        };
        promise_arr.push(this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.student_remark, student_remark_data));
        this.vm.extraFieldList.forEach((item, index)=>{
                const extra_data = {
                    'parentTerm': this.vm.selectedTerm.id,
                    'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                    'parentExtraField': item.id,
                    'parentStudent__in': this.vm.studentSectionList.filter(studentSection => {
                        return studentSection.parentClass == this.vm.selectedClassSection.class.id
                            && studentSection.parentDivision == this.vm.selectedClassSection.section.id;
                    }).map(item => item.parentStudent).join(','),
                };
                promise_arr.push(this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.student_extra_field,
                    extra_data));
            }
        );
        this.vm.isLoading = true;

        Promise.all(promise_arr).then(value => {
            this.vm.studentRemarkList = value[0];
            value.forEach((item, index) => {
                this.vm.studentExtraFieldList.push(item);
            });
            this.vm.isLoading = false;
            this.vm.showStudentList = true;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    // updateStudentRemark(studentSection: any, newRemark: any, element: any): void {
    //
    //     if (this.vm.getStudentRemark(studentSection) != newRemark) {
    //
    //         let prev_student_remark = this.vm.studentRemarkList.find(studentRemark => {
    //             return studentRemark.parentStudent == studentSection.parentStudent;
    //         });
    //
    //         let service_list = [];
    //
    //         if (prev_student_remark) {
    //             let student_remark_data = {
    //                 'id': prev_student_remark.id,
    //                 'parentStudent': prev_student_remark.parentStudent,
    //                 'parentSession': prev_student_remark.parentSession,
    //                 'remark': newRemark,
    //             };
    //             service_list.push(this.vm.reportCardCbseService.updateObject(this.vm.reportCardCbseService.student_remark,student_remark_data));
    //         } else {
    //             let student_remark_data = {
    //                 'parentStudent': studentSection.parentStudent,
    //                 'parentSession': studentSection.parentSession,
    //                 'remark': newRemark,
    //             };
    //             service_list.push(this.vm.reportCardCbseService.createObject(this.vm.reportCardCbseService.student_remark,student_remark_data));
    //         }
    //
    //         element.classList.add('updatingField');
    //
    //         Promise.all(service_list).then(value => {
    //
    //             if(prev_student_remark) {
    //                 this.vm.studentRemarkList.find(studentRemark => {
    //                     return studentRemark.id == value[0].id;
    //                 }).remark = value[0].remark;
    //             } else {
    //                 this.vm.studentRemarkList.push(value[0]);
    //             }
    //
    //             element.classList.remove('updatingField');
    //
    //         }, error => {
    //             // Nothing to do here
    //         })
    //
    //     }
    //
    // }

}
