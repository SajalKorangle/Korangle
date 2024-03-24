import { DesignReportCardComponent } from './design-report-card.component';
import { StudentCustomParameterStructure } from './../../class/constants_3';
import { values } from 'lodash';

export class DesignReportCardServiceAdapter {
    vm: DesignReportCardComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: DesignReportCardComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        this.vm.DATA.currentSession = this.vm.user.activeSchool.currentSessionDbId;
        const report_card_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const request_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };
        const request_student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const request_examination_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };
        const request_grade_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const request_sub_grade_data = {
            parentGrade__parentSchool: this.vm.user.activeSchool.dbId,
        };
        const request_test_data = {
            parentExamination__parentSchool: this.vm.user.activeSchool.dbId,
            parentExamination__parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };
        const public_layouts_data = {
            publiclyShared: 'True',
        };
        const shared_layout_list_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const request_class_signature_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        this.vm.htmlAdapter.isLoading = true;
        Promise.all([
            this.vm.reportCardService.getObjectList(this.vm.reportCardService.report_card_layout_new, report_card_layouts_data), // 0
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: request_student_section_data, pagination: {start: 0, end: 1}}), // 1
            this.vm.genericService.getObjectList({student_app: 'StudentParameter'}, {filter: request_student_parameter_data}), // 2
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 3
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 4
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data), // 5
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_test_data), // 6
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), // 7
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 8
            this.vm.gradeService.getObjectList(this.vm.gradeService.grade, request_grade_data), // 9
            this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grade, request_sub_grade_data), // 10
            this.vm.reportCardService.getObjectList(this.vm.reportCardService.report_card_layout_new, public_layouts_data), //11
            this.vm.reportCardService.getObjectList(this.vm.reportCardService.layout_sharing, shared_layout_list_data), //12
            this.vm.classService.getObjectList(this.vm.classService.class_teacher_signature, request_class_signature_data), //13
        ])
            .then((data) => {
                this.vm.reportCardLayoutList = data[0];
                this.vm.DATA.data.studentSectionList = data[1];
                this.vm.DATA.data.studentParameterList = data[2];
                this.vm.DATA.data.classList = data[3];
                this.vm.DATA.data.divisionList = data[4];
                this.vm.DATA.data.examinationList = data[5];
                this.vm.DATA.data.testList = data[6];
                this.vm.DATA.data.subjectList = data[7];
                this.vm.DATA.data.sessionList = data[8];
                this.vm.DATA.data.gradeList = data[9];
                this.vm.DATA.data.subGradeList = data[10];
                this.vm.publicLayoutList = data[11];
                this.vm.DATA.data.classSectionSignatureList = data[13];
                const request_student_data = {
                    id__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent),
                };
                const request_student_parameter_value_data = {
                    parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent),
                };
                const request_student_test_data = {
                    parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent),
                    parentExamination__in: this.vm.DATA.data.examinationList.map((item) => item.id),
                };
                const request_attendance_data = {
                    parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent).join(','),
                    dateOfAttendance__gte:
                        this.vm.DATA.data.sessionList.find((session) => {
                            return session.id === this.vm.user.activeSchool.currentSessionDbId;
                        }).startDate,
                    dateOfAttendance__lte:
                        this.vm.DATA.data.sessionList.find((session) => {
                            return session.id === this.vm.user.activeSchool.currentSessionDbId;
                        }).endDate,
                };
                const request_student_sub_grade_data = {
                    parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent).join(','),
                };
                const request_student_examination_remarks_data = {
                    parentExamination__parentSchool: this.vm.user.activeSchool.dbId,
                    parentExamination__parentSession: this.vm.user.activeSchool.currentSessionDbId,
                    parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent).join(','),
                };

                const request_layout_sharing_data = {
                    parentLayout__in: this.vm.reportCardLayoutList.map((l) => l.id).join(','),
                };

                const shared_layout_data = {
                    id__in: data[12].map((sharedLayoutRelation) => sharedLayoutRelation.parentLayout).join(','),
                };

                Promise.all([
                    this.vm.genericService.getObjectList({student_app: 'Student'}, {filter: request_student_data}), // 0
                    this.vm.genericService.getObjectList({student_app: 'StudentParameterValue'}, {filter: request_student_parameter_value_data}), // 1
                    this.vm.genericService.getObjectList({examination_app: 'StudentTest'}, {filter: request_student_test_data}), // 2
                    this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, request_attendance_data), // 3
                    this.vm.gradeService.getObjectList(this.vm.gradeService.student_sub_grade, request_student_sub_grade_data), // 4
                    this.vm.examinationService.getObjectList(
                        this.vm.examinationService.student_examination_remarks,
                        request_student_examination_remarks_data
                    ), // 5
                    this.vm.reportCardService.getObjectList(this.vm.reportCardService.layout_sharing, request_layout_sharing_data), //6
                    this.vm.reportCardService.getObjectList(this.vm.reportCardService.report_card_layout_new, shared_layout_data), //7
                ]).then(
                    (value) => {
                        this.vm.DATA.data.studentList = value[0];
                        this.vm.DATA.data.studentParameterValueList = value[1];
                        this.vm.DATA.data.studentTestList = value[2];
                        this.vm.DATA.data.attendanceList = value[3];
                        this.vm.DATA.data.studentSubGradeList = value[4];
                        this.vm.DATA.data.studentExaminationRemarksList = value[5];
                        this.vm.sharedLayoutList = value[7];

                        if (this.vm.DATA.data.studentList.length > 0) this.vm.DATA.studentId = this.vm.DATA.data.studentList[0].id;
                        else alert('Student Data unavaiable');
                        this.populateLayoutSharingData(value[6]);
                        this.vm.htmlAdapter.isLoading = false;
                        this.vm.htmlAdapter.openInventory();
                    },
                    (error) => {
                        this.vm.htmlAdapter.isLoading = false;
                    }
                );
                this.populateParameterListWithStudentCustomField();
            })
            .catch((err) => {
                this.vm.htmlAdapter.isLoading = false;
            });
    }

    populateParameterListWithStudentCustomField(): void {
        this.vm.DATA.data.studentParameterList.forEach((studentParameter) => {
            this.vm.htmlAdapter.parameterList.push(
                StudentCustomParameterStructure.getStructure(studentParameter.name, studentParameter.id)
            );
        });
    }

    async loadSelectedStudent() {
        this.vm.htmlAdapter.isSaving = true;
        const request_student_section_data = {
            parentStudent: this.vm.selectedStudent.id,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const request_student_data = {
            id: this.vm.selectedStudent.id,
        };
        const request_student_parameter_value_data = {
            parentStudent: this.vm.selectedStudent.id,
        };
        const request_student_test_data = {
            parentStudent: this.vm.selectedStudent.id,
            parentExamination__in: this.vm.DATA.data.examinationList.map((item) => item.id),
        };
        const request_attendance_data = {
            parentStudent: this.vm.selectedStudent.id,
            dateOfAttendance__gte:
                new Date(
                    this.vm.DATA.data.sessionList.find((session) => {
                        return session.id === this.vm.user.activeSchool.currentSessionDbId;
                    }).startDate
                ).getFullYear() + '-01-01', // We are getting the attendance of whole first year just to be safe
            dateOfAttendance__lte:
                new Date(
                    this.vm.DATA.data.sessionList.find((session) => {
                        return session.id === this.vm.user.activeSchool.currentSessionDbId;
                    }).endDate
                ).getFullYear() + '-12-31', // We are getting the attendance of whole second year just to be safe
        };
        const request_student_sub_grade_data = {
            parentStudent: this.vm.selectedStudent.id,
        };
        const request_student_examination_remarks_data = {
            parentExamination__parentSchool: this.vm.user.activeSchool.dbId,
            parentExamination__parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent: this.vm.selectedStudent.id,
        };

        Promise.all([
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: request_student_section_data}), // 0
            this.vm.genericService.getObjectList({student_app: 'Student'}, {filter: request_student_data}), // 1
            this.vm.genericService.getObjectList({student_app: 'StudentParameterValue'}, {filter: request_student_parameter_value_data}), // 2
            this.vm.genericService.getObjectList({examination_app: 'StudentTest'}, {filter: request_student_test_data}), // 3
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, request_attendance_data), // 4
            this.vm.gradeService.getObjectList(this.vm.gradeService.student_sub_grade, request_student_sub_grade_data), // 5
            this.vm.examinationService.getObjectList(
                this.vm.examinationService.student_examination_remarks,
                request_student_examination_remarks_data
            ), // 6
        ]).then((value) => {
            this.vm.DATA.data.studentSectionList.push(...value[0]);
            this.vm.DATA.data.studentList.push(...value[1]);
            this.vm.DATA.data.studentParameterValueList.push(...value[2]);
            this.vm.DATA.data.studentTestList.push(...value[3]);
            this.vm.DATA.data.attendanceList.push(...value[4]);
            this.vm.DATA.data.studentSubGradeList.push(...value[5]);
            this.vm.DATA.data.studentExaminationRemarksList.push(...value[6]);

            this.vm.DATA.studentId = this.vm.selectedStudent.id;

            this.vm.canvasAdapter.fullCanavsRefresh();

            this.vm.htmlAdapter.isSaving = false;
        });
    }

    populateLayoutSharingData(layoutSharingDataList: Array<any>): void {
        this.vm.reportCardLayoutList.forEach((layout) => (this.vm.layoutSharingData[layout.id] = []));
        layoutSharingDataList.forEach((layoutSharingData) => {
            this.vm.layoutSharingData[layoutSharingData.parentLayout].push(layoutSharingData);
        });
    }

    async uploadCurrentLayout() {
        const layoutToUpload: { [key: string]: any; } = { ...this.vm.currentLayout, content: JSON.stringify(this.vm.currentLayout.content) };
        if (this.vm.currentLayout.thumbnail.startsWith('data')) {
            // converting data uri to blob
            layoutToUpload.thumbnail = await fetch(this.vm.currentLayout.thumbnail).then((response) => response.blob());
        } else {
            delete layoutToUpload.thumbnail;
        }

        const form_data = new FormData();
        Object.entries(layoutToUpload).forEach(([key, value]) => {
            if (key === 'thumbnail') {
                form_data.append(key, value, `${this.vm.currentLayout.parentSchool}-${this.vm.currentLayout.name}.png`);
            } else {
                form_data.append(key, value);
            }
        });

        if (layoutToUpload.id) {
            // if previously saved then update
            return this.vm.reportCardService
                .partiallyUpdateObject(this.vm.reportCardService.report_card_layout_new, form_data)
                .then((savedLayout) => {
                    let indexOfSavedLayoutInReportCardLayoutList = this.vm.reportCardLayoutList.findIndex(
                        (layout) => layout.id == savedLayout.id
                    );
                    this.vm.reportCardLayoutList[indexOfSavedLayoutInReportCardLayoutList] = {
                        ...this.vm.reportCardLayoutList[indexOfSavedLayoutInReportCardLayoutList],
                        ...savedLayout,
                    };
                });
        } else {
            // if previously not saved then create
            return this.vm.reportCardService
                .createObject(this.vm.reportCardService.report_card_layout_new, form_data)
                .then((savedLayout) => {
                    savedLayout.id = parseInt(savedLayout.id);
                    this.vm.currentLayout.id = savedLayout.id;
                    this.vm.reportCardLayoutList.push(savedLayout);
                    this.vm.layoutSharingData[savedLayout.id] = [];
                });
        }
    }

    uploadImageForCurrentLayout(image, file_name) {
        let formdata = new FormData();
        formdata.append('image', image, file_name);
        return this.vm.reportCardService.createObject(this.vm.reportCardService.image_assets, formdata).then((response) => response.image);
    }

    deleteCurrentLayout(): void {
        if (this.vm.currentLayout.id) {
            if (!confirm('Are you sure you want to delete the current layout')) {
                return;
            }
            const current_layut_id = this.vm.currentLayout.id;
            const layout_delete_request = {
                id: current_layut_id,
            };
            this.vm.htmlAdapter.isSaving = true;
            this.vm.reportCardService
                .deleteObject(this.vm.reportCardService.report_card_layout_new, layout_delete_request)
                .then((response) => {
                    const currentLayoutIndex = this.vm.reportCardLayoutList.findIndex((layout) => layout.id == current_layut_id);
                    this.vm.reportCardLayoutList.splice(currentLayoutIndex, 1);
                    this.vm.populateCurrentLayoutWithGivenValue(this.vm.ADD_LAYOUT_STRING, false, true);
                    this.vm.htmlAdapter.isSaving = false;
                });
        }
    }

    shareCurrentLayoutWithSchool(schoolKID: number) {
        if (schoolKID != this.vm.user.activeSchool.dbId) {
            const layoutSharingData = { parentSchool: schoolKID, parentLayout: this.vm.currentLayout.id };
            // console.log(layoutSharingData);
            return this.vm.reportCardService.createObject(this.vm.reportCardService.layout_sharing, layoutSharingData);
        }
    }

    currentLayoutPublicToggle() {
        const layoutToUpload = { id: this.vm.currentLayout.id, publiclyShared: !this.vm.currentLayout.publiclyShared };
        return this.vm.reportCardService
            .partiallyUpdateObject(this.vm.reportCardService.report_card_layout_new, layoutToUpload)
            .then((savedLayout) => {
                let indexOfSavedLayoutInReportCardLayoutList = this.vm.reportCardLayoutList.findIndex(
                    (layout) => layout.id == savedLayout.id
                );
                this.vm.reportCardLayoutList[indexOfSavedLayoutInReportCardLayoutList].publiclyShared = savedLayout.publiclyShared;
                if (this.vm.currentLayout.id == savedLayout.id) {
                    this.vm.currentLayout.publiclyShared = savedLayout.publiclyShared;
                }
                // adjusting public layout list accordingly
                if (this.vm.reportCardLayoutList[indexOfSavedLayoutInReportCardLayoutList].publiclyShared) {
                    this.vm.publicLayoutList.push(this.vm.reportCardLayoutList[indexOfSavedLayoutInReportCardLayoutList]);
                } else {
                    let prevPublicIndex = this.vm.publicLayoutList.findIndex((l) => l.id == savedLayout.id);
                    this.vm.publicLayoutList.splice(prevPublicIndex, 1);
                }
            });
    }

    deleteLayoutSharing(layoutSharingData: any) {
        const delete_request = { id: layoutSharingData.id };
        return this.vm.reportCardService.deleteObject(this.vm.reportCardService.layout_sharing, delete_request);
    }

    getSchoolList(data: any) {
        return this.vm.schoolService.getObjectList(this.vm.schoolService.school_summary, data);
    }
}
