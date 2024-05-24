import { DesignTCComponent } from './design-tc.component';
import { StudentCustomParameterStructure } from './../../class/constants';

export class DesignTCServiceAdapter {
    vm: DesignTCComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: DesignTCComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        this.vm.DATA.currentSession = this.vm.user.activeSchool.currentSessionDbId;
        const tc_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const request_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };
        const request_student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
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

        const request_tc_settings = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        this.vm.htmlAdapter.isLoading = true;
        Promise.all([
            this.vm.tcService.getObjectList(this.vm.tcService.tc_layout, tc_layouts_data), // 0
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {
                filter: request_student_section_data,
                pagination: {
                    start: 0,
                    end: 1,
                },
            }), // 1
            this.vm.genericService.getObjectList({ student_app: 'StudentParameter' }, {
                filter: request_student_parameter_data,
            }), // 2
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 3
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 4
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), // 5
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 6
            this.vm.tcService.getObjectList(this.vm.tcService.tc_layout, public_layouts_data), // 7
            this.vm.classService.getObjectList(this.vm.classService.class_teacher_signature, request_class_signature_data), //8
            this.vm.tcService.getObjectList(this.vm.tcService.tc_layout_sharing, shared_layout_list_data), //9
            this.vm.tcService.getObject(this.vm.tcService.tc_settings, request_tc_settings), // 10
        ])
            .then((data) => {
                this.vm.tcLayoutList = data[0];
                this.vm.DATA.data.studentSectionList = data[1];
                this.vm.DATA.data.studentParameterList = data[2];
                this.vm.DATA.data.classList = data[3];
                this.vm.DATA.data.divisionList = data[4];
                this.vm.DATA.data.subjectList = data[5];
                this.vm.DATA.data.sessionList = data[6];
                this.vm.publicLayoutList = data[7];
                this.vm.DATA.data.classSectionSignatureList = data[8];
                this.vm.DATA.certificateNumber = data[10] ? data[10].nextCertificateNumber : 1;
                const request_student_data = {
                    id__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent),
                };
                const request_student_parameter_value_data = {
                    parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent),
                };
                const request_attendance_data = {
                    parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent).join(','),
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

                const request_layout_sharing_data = {
                    parentLayout__in: this.vm.tcLayoutList.map((l) => l.id).join(','),
                };

                const shared_layout_data = {
                    id__in: data[9].map((sharedLayoutRelation) => sharedLayoutRelation.parentLayout).join(','),
                };

                Promise.all([
                    this.vm.genericService.getObjectList({student_app: 'Student'}, {filter: request_student_data}), // 0
                    this.vm.genericService.getObjectList({student_app: 'StudentParameterValue'}, {filter: request_student_parameter_value_data}), // 1
                    this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, request_attendance_data), // 2
                    this.vm.tcService.getObjectList(this.vm.tcService.tc_layout_sharing, request_layout_sharing_data), //3
                    this.vm.tcService.getObjectList(this.vm.tcService.tc_layout, shared_layout_data), //4
                ]).then(
                    (value) => {
                        this.vm.DATA.data.studentList = value[0];
                        this.vm.DATA.data.studentParameterValueList = value[1];
                        this.vm.DATA.data.attendanceList = value[2];
                        this.vm.sharedLayoutList = value[4];

                        if (this.vm.DATA.data.studentList.length > 0) this.vm.DATA.studentId = this.vm.DATA.data.studentList[0].id;
                        else alert('Student Data unavaiable');
                        this.populateLayoutSharingData(value[3]);
                        this.vm.htmlAdapter.isLoading = false;
                        this.vm.htmlAdapter.openInventory();
                    }
                );
                this.populateParameterListWithStudentCustomField();
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
        const request_attendance_data = {
            parentStudent: this.vm.selectedStudent.id,
            dateOfAttendance__gte:
                new Date(
                    this.vm.DATA.data.sessionList.find((session) => {
                        return session.id === this.vm.user.activeSchool.currentSessionDbId;
                    }).startDate
                ).getFullYear() + '-01-01',
            dateOfAttendance__lte:
                new Date(
                    this.vm.DATA.data.sessionList.find((session) => {
                        return session.id === this.vm.user.activeSchool.currentSessionDbId;
                    }).endDate
                ).getFullYear() + '-12-31',
        };

        Promise.all([
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: request_student_section_data}), // 0
            this.vm.genericService.getObjectList({student_app: 'Student'}, {filter: request_student_data}), // 1
            this.vm.genericService.getObjectList({student_app: 'StudentParameterValue'}, {filter: request_student_parameter_value_data}), // 2
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, request_attendance_data), // 3
        ]).then((value) => {
            // check here, getObjectList to getObject
            this.vm.DATA.data.studentSectionList.push(...value[0]);
            this.vm.DATA.data.studentList.push(...value[1]);
            this.vm.DATA.data.studentParameterValueList.push(...value[2]);
            this.vm.DATA.data.attendanceList.push(...value[3]);

            this.vm.DATA.studentId = this.vm.selectedStudent.id;
            this.vm.canvasAdapter.fullCanavsRefresh();

            this.vm.htmlAdapter.isSaving = false;
        });
    }

    populateLayoutSharingData(layoutSharingDataList: Array<any>): void {
        this.vm.tcLayoutList.forEach((layout) => (this.vm.layoutSharingData[layout.id] = []));
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
            if (!value) return;
            if (key === 'thumbnail') {
                form_data.append(key, value, `${this.vm.currentLayout.parentSchool}-${this.vm.currentLayout.name}.png`);
            } else {
                form_data.append(key, value);
            }
        });

        if (layoutToUpload.id) {
            // if previously saved then update
            return this.vm.tcService.partiallyUpdateObject(this.vm.tcService.tc_layout, form_data).then((savedLayout) => {
                let indexOfSavedLayoutInReportCardLayoutList = this.vm.tcLayoutList.findIndex((layout) => layout.id == savedLayout.id);
                this.vm.tcLayoutList[indexOfSavedLayoutInReportCardLayoutList] = {
                    ...this.vm.tcLayoutList[indexOfSavedLayoutInReportCardLayoutList],
                    ...savedLayout,
                };
            });
        } else {
            // if previously not saved then create
            return this.vm.tcService.createObject(this.vm.tcService.tc_layout, form_data).then((savedLayout) => {
                savedLayout.id = parseInt(savedLayout.id);
                this.vm.currentLayout.id = savedLayout.id;
                this.vm.tcLayoutList.push(savedLayout);
                this.vm.layoutSharingData[savedLayout.id] = [];
            });
        }
    }

    uploadImageForCurrentLayout(image, file_name) {
        let formdata = new FormData();
        formdata.append('image', image, file_name);
        return this.vm.tcService.createObject(this.vm.tcService.tc_image_assets, formdata).then((response) => response.image);
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
            this.vm.tcService.deleteObject(this.vm.tcService.tc_layout, layout_delete_request).then((response) => {
                const currentLayoutIndex = this.vm.tcLayoutList.findIndex((layout) => layout.id == current_layut_id);
                this.vm.tcLayoutList.splice(currentLayoutIndex, 1);
                this.vm.populateCurrentLayoutWithGivenValue(this.vm.ADD_LAYOUT_STRING, false, true);
                this.vm.htmlAdapter.isSaving = false;
            });
        }
    }

    shareCurrentLayoutWithSchool(schoolKID: number) {
        if (schoolKID != this.vm.user.activeSchool.dbId) {
            const layoutSharingData = { parentSchool: schoolKID, parentLayout: this.vm.currentLayout.id };
            return this.vm.tcService.createObject(this.vm.tcService.tc_layout_sharing, layoutSharingData);
        }
    }

    currentLayoutPublicToggle() {
        const layoutToUpload = { id: this.vm.currentLayout.id, publiclyShared: !this.vm.currentLayout.publiclyShared };
        return this.vm.tcService.partiallyUpdateObject(this.vm.tcService.tc_layout, layoutToUpload).then((savedLayout) => {
            let indexOfSavedLayoutInReportCardLayoutList = this.vm.tcLayoutList.findIndex((layout) => layout.id == savedLayout.id);
            this.vm.tcLayoutList[indexOfSavedLayoutInReportCardLayoutList].publiclyShared = savedLayout.publiclyShared;
            if (this.vm.currentLayout.id == savedLayout.id) {
                this.vm.currentLayout.publiclyShared = savedLayout.publiclyShared;
            }
            // adjusting public layout list accordingly
            if (this.vm.tcLayoutList[indexOfSavedLayoutInReportCardLayoutList].publiclyShared) {
                this.vm.publicLayoutList.push(this.vm.tcLayoutList[indexOfSavedLayoutInReportCardLayoutList]);
            } else {
                let prevPublicIndex = this.vm.publicLayoutList.findIndex((l) => l.id == savedLayout.id);
                this.vm.publicLayoutList.splice(prevPublicIndex, 1);
            }
        });
    }

    deleteLayoutSharing(layoutSharingData: any) {
        const delete_request = { id: layoutSharingData.id };
        return this.vm.tcService.deleteObject(this.vm.tcService.tc_layout_sharing, delete_request);
    }

    getSchoolList(data: any) {
        return this.vm.schoolService.getObjectList(this.vm.schoolService.school_summary, data);
    }
}
