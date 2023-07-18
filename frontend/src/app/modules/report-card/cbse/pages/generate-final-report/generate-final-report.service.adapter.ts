import { GenerateFinalReportComponent } from './generate-final-report.component';
import { ATTENDANCE_STATUS_LIST } from '../../../../attendance/classes/constants';

export class GenerateFinalReportServiceAdapter {
    vm: GenerateFinalReportComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;

    initializeAdapter(vm: GenerateFinalReportComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach((key) => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    initializeData(): void {
        this.vm.isLoading = true;

        let report_card_mapping_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_section_data = {
            parentStudent__parentTransferCertificate: 'null__korangle',
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const teacher_signature_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.report_card_mapping, report_card_mapping_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, ''),
            this.vm.classService.getObjectList(this.vm.classService.division, ''),
            this.vm.classService.getObjectList(this.vm.classService.class_teacher_signature, teacher_signature_data),
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}),
        ]).then(
            (value) => {
                this.vm.sessionList = value[5];
                this.vm.classTeacherSignatureList = value[4];
                if (value[0].length > 0 || value[1].length > 0) {
                    this.vm.reportCardMappingList = value[0];
                    this.vm.studentSectionList = value[1];
                    this.vm.studentSectionList.forEach((studentSection) => {
                        studentSection['selected'] = false;
                    });
                    let student_data = {
                        id__in: this.vm.studentSectionList.map((a) => a.parentStudent),
                        fields__korangle: 'id,profileImage,name,fathersName,scholarNumber,dateOfBirth',
                    };
                    Promise.all([this.vm.studentService.getObjectList(this.vm.studentService.student, student_data)]).then(
                        (value2) => {
                            this.vm.studentList = value2[0];
                            Promise.all([
                                this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.term, ''),
                                this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.extra_field, ''),
                                this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
                            ]).then((value3) => {
                                this.vm.termList = value3[0];
                                this.vm.extraFieldList = value3[1];
                                this.vm.subjectList = value3[2];
                            });
                            this.vm.studentSectionList.forEach((studentSection) => {
                                studentSection['student'] = value2[0].find((student) => {
                                    return student.id == studentSection.parentStudent;
                                });
                                studentSection['selected'] = false;
                            });
                            this.vm.isLoading = false;
                        },
                        (error) => {
                            this.vm.isLoading = false;
                        }
                    );
                    this.vm.classSectionList = [];
                    value[2].filter((classs) => {
                        value[3].filter((section) => {
                            if (
                                this.vm.studentSectionList.find((studentSection) => {
                                    return studentSection.parentClass == classs.id && studentSection.parentDivision == section.id;
                                }) != undefined
                            ) {
                                this.vm.classSectionList.push({
                                    class: classs,
                                    section: section,
                                    selected: false,
                                });
                            }
                        });
                    });
                    if (this.vm.classSectionList.length > 0) {
                        this.vm.selectedClassSection = this.vm.classSectionList[0];
                    }
                } else {
                    this.vm.isLoading = false;
                }
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    getExaminationIdList(): any {
        let id_list = [];
        this.vm.reportCardMappingList.forEach((reportCardMapping) => {
            id_list.push(reportCardMapping.parentExaminationPeriodicTest);
            id_list.push(reportCardMapping.parentExaminationNoteBook);
            id_list.push(reportCardMapping.parentExaminationSubEnrichment);
            id_list.push(reportCardMapping.parentExaminationFinalTerm);
        });
        return [...new Set(id_list)].join(',');
    }

    getStudentIdList(): any {
        return this.vm
            .getFilteredStudentSectionList()
            .filter((studentSection) => {
                return studentSection.selected;
            })
            .map((studentSection) => {
                return studentSection.parentStudent;
            })
            .join(',');
    }

    getStudentFinalReport(): void {
        let service_list = [];

        let test_data = {
            parentExamination__in: this.getExaminationIdList(),
        };

        service_list.push(this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, test_data));

        /*let student_profile_data = {
            'id__in': this.getStudentIdList(),
            'fields__korangle': 'id,profileImage,name,fathersName,scholarNumber',
        };

        service_list.push(this.vm.studentService.getObjectList(this.vm.studentService.student, student_profile_data));*/

        let student_test_data = {
            parentExamination__in: this.getExaminationIdList(),
            parentStudent__in: this.getStudentIdList(),
        };

        service_list.push(this.vm.examinationService.getObjectList(this.vm.examinationService.student_test, student_test_data));

        let student_extra_field_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__in: this.getStudentIdList(),
        };

        service_list.push(
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.student_extra_field, student_extra_field_data)
        );

        let student_remark_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__in: this.getStudentIdList(),
        };

        service_list.push(this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.student_remark, student_remark_data));

        this.vm.reportCardMappingList.forEach((reportCardMapping, index) => {
            let attendance_data = {
                parentStudent__in: this.getStudentIdList(),
                dateOfAttendance__gte: '2011-11-01',
                dateOfAttendance__lte: '2011-10-31',
            };
            if (this.vm.selectedClassSection.class.orderNumber >= 5 && index != 2) {
                if (reportCardMapping.attendanceStartDate && reportCardMapping.attendanceEndDate) {
                    attendance_data['dateOfAttendance__gte'] = reportCardMapping.attendanceStartDate;
                    attendance_data['dateOfAttendance__lte'] = reportCardMapping.attendanceEndDate;
                }
            } else if (this.vm.selectedClassSection.class.orderNumber < 5 && index == 2) {
                if (reportCardMapping.attendanceStartDate && reportCardMapping.attendanceEndDate) {
                    attendance_data['dateOfAttendance__gte'] = reportCardMapping.attendanceStartDate;
                    attendance_data['dateOfAttendance__lte'] = reportCardMapping.attendanceEndDate;
                }
            }
            service_list.push(this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, attendance_data));
        });

        let class_subject_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentClass: this.vm.selectedClassSection.class.id,
            parentDivision: this.vm.selectedClassSection.section.id,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        service_list.push(this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_data));

        this.vm.isLoading = true;

        Promise.all(service_list).then(
            (value) => {
                this.vm.testList = value[0];
                this.vm.studentTestList = value[1];
                this.vm.studentExtraFieldList = value[2];
                this.vm.studentRemarkList = value[3];

                // This line seems to be holding the integrity of the student attendance so don't delete it
                // even though it seems that it is just appending the data but the new called data doesn't seem to
                // be recognised.
                this.vm.termStudentAttendanceList = [];

                this.vm.termStudentAttendanceList.push(value[4]);
                this.vm.termStudentAttendanceList.push(value[5]);
                this.vm.termStudentAttendanceList.push(value[6]);
                this.vm.classSubjectList = value[7].sort((a, b) => {
                    return a.orderNumber - b.orderNumber;
                });
                const signature = this.vm.classTeacherSignatureList.find((sign) => {
                    return (
                        sign.parentClass === this.vm.selectedClassSection.class.id &&
                        sign.parentDivision === this.vm.selectedClassSection.section.id
                    );
                });
                if (signature && this.vm.showClassTeacherSignature) {
                    this.vm.classTeacherSignature = signature;
                } else {
                    this.vm.classTeacherSignature = null;
                }

                this.vm.isLoading = false;

                this.vm.printStudentFinalReport();
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
