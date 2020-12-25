import { DesignReportCardComponent } from './design-report-card.component';

export class DesignReportCardServiceAdapter {

    vm: DesignReportCardComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: DesignReportCardComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        const report_card_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId
        };
        const request_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            korangle__count: '0,9'
        };
        const request_student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const request_examination_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId
        };
        const request_grade_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const request_sub_grade_data = {
            parentGrade__parentSchool: this.vm.user.activeSchool.dbId,
        };
        const request_test_data = {
            parentExamination__parentSchool: this.vm.user.activeSchool.dbId,
            parentExamination__parentSession: this.vm.user.activeSchool.currentSessionDbId
        };
        this.vm.htmlAdapter.isLoading = true;
        Promise.all([
            this.vm.reportCardService.getObjectList(this.vm.reportCardService.report_card_layout_new, report_card_layouts_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data), // 1
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, request_student_parameter_data), // 2
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 3
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 4
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data), // 5
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_test_data), // 6
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), // 7
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 8
            this.vm.gradeService.getObjectList(this.vm.gradeService.grade, request_grade_data), // 9
            this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grade, request_sub_grade_data), // 10
        ]).then(data => { 
            this.vm.reportCardLayoutList = data[0];
            this.vm.data.studentSectionList = data[1];
            this.vm.data.studentParameterList = data[2];
            this.vm.data.classList = data[3];
            this.vm.data.divisionList = data[4];
            this.vm.data.examinationList = data[5];
            this.vm.data.testList = data[6];
            this.vm.data.subjectList = data[7];
            this.vm.data.sessionList = data[8];
            this.vm.data.gradeList = data[9];
            this.vm.data.subGradeList = data[10];

            const request_student_data = {
                id__in: this.vm.data.studentSectionList.map(item => item.parentStudent).join(','),
            };
            const request_student_parameter_value_data = {
                parentStudent__in: this.vm.data.studentSectionList.map(item => item.parentStudent).join(','),
            };
            const request_student_test_data = {
                parentStudent__in: this.vm.data.studentSectionList.map(item => item.parentStudent).join(','),
                parentExamination__in: this.vm.data.examinationList.map(item => item.id).join(','),
            };
            const request_attendance_data = {
                parentStudent__in: this.vm.data.studentSectionList.map(item => item.parentStudent).join(','),
                'dateOfAttendance__gte': (new Date(this.vm.data.sessionList.find(session => { return session.id === this.vm.user.activeSchool.currentSessionDbId}).startDate)).getFullYear() + '-01-01',
                'dateOfAttendance__lte': (new Date(this.vm.data.sessionList.find(session => { return session.id === this.vm.user.activeSchool.currentSessionDbId}).endDate)).getFullYear() + '-12-31',
            };
            const request_student_sub_grade_data = {
                parentStudent__in: this.vm.data.studentSectionList.map(item => item.parentStudent).join(','),
            };
            const request_student_examination_remarks_data = {
                parentExamination__parentSchool: this.vm.user.activeSchool.dbId,
                parentExamination__parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentStudent__in: this.vm.data.studentSectionList.map(item => item.parentStudent).join(','),
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data), // 0
                this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, request_student_parameter_value_data), // 1
                this.vm.examinationService.getObjectList(this.vm.examinationService.student_test, request_student_test_data), // 2
                this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, request_attendance_data), // 3
                this.vm.gradeService.getObjectList(this.vm.gradeService.student_sub_grade, request_student_sub_grade_data), // 4
                this.vm.examinationService.getObjectList(this.vm.examinationService.student_examination_remarks, request_student_examination_remarks_data), // 5
            ]).then(value => {
                this.vm.data.studentList = value[0];
                this.vm.data.studentParameterValueList = value[1];
                this.vm.data.studentTestList = value[2];
                this.vm.data.attendanceList = value[3];
                this.vm.data.studentSubGradeList = value[4];
                this.vm.data.studentExaminationRemarksList = value[5];
                this.vm.htmlAdapter.isLoading = false;
            }, error => {
                this.vm.htmlAdapter.isLoading = false;
            });
            this.populateParameterListWithStudentCustomField();
        }).catch(err => {
            this.vm.htmlAdapter.isLoading = false;
        })
    }

    populateParameterListWithStudentCustomField(): void {
        // this.vm.data.studentParameterList.forEach(studentParameter => {
        //     this.vm.parameterList.push(StudentCustomParameterStructure.getStructure(
        //         studentParameter.id
        //     ));
        // });
        // uncomment afetr copying parameters
    }

    uploadCurrentLayout() {
        const layoutToUpload = { ...this.vm.currentLayout, content: JSON.stringify(this.vm.currentLayout.content) };
        if (layoutToUpload.id) {    // if previously saved then update
            return this.vm.reportCardService.updateObject(this.vm.reportCardService.report_card_layout_new, layoutToUpload).then(savedLayout => {
                let indexOfSavedLayoutInReportCardLayoutList = this.vm.reportCardLayoutList.findIndex(layout => layout.id == savedLayout.id);
                this.vm.reportCardLayoutList[indexOfSavedLayoutInReportCardLayoutList] = savedLayout;
            })
        }
        else {  // if previously not saved then create
            return this.vm.reportCardService.createObject(this.vm.reportCardService.report_card_layout_new, layoutToUpload).then(savedLayout => {
                savedLayout.id = parseInt(savedLayout.id);
                console.log('created Object: ', savedLayout);
                this.vm.currentLayout.id = savedLayout.id;
                this.vm.reportCardLayoutList.push(savedLayout);
            })
        }
    }

    uploadImageForCurrentLayout(image, file_name) {
        let formdata = new FormData();
        formdata.append('parentLayout', this.vm.currentLayout.id);
        formdata.append('image', image, file_name);
        return this.vm.reportCardService.createObject(this.vm.reportCardService.image_assets, formdata).then(response => response.image);
    }

    deleteCurrentLayout(): void{
        if (this.vm.currentLayout.id) {
            const current_layut_id = this.vm.currentLayout.id
            const layout_delete_request = {
                id: current_layut_id
            };
            this.vm.htmlAdapter.isSaving = true;
            this.vm.reportCardService.deleteObject(this.vm.reportCardService.report_card_layout_new, layout_delete_request).then(response => {
                delete this.vm.currentLayout.id;
                const currentLayoutIndex = this.vm.reportCardLayoutList.findIndex(layout => layout.id == current_layut_id);
                delete this.vm.reportCardLayoutList[currentLayoutIndex];
                this.vm.reportCardLayoutList = this.vm.reportCardLayoutList.filter(Boolean); // removing empty slots from array
                this.vm.htmlAdapter.isSaving = false;
            })
        }
    }
}



