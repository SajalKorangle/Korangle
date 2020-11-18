import { DesignReportCardComponent } from './design-report-card.component';
import { StudentCustomParameterStructure} from '@modules/report-card/class/constants';

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
        this.vm.isLoading = true;
        Promise.all([
            this.vm.reportCardService.getObjectList(this.vm.reportCardService.report_card_layout, report_card_layouts_data), // 0
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
                this.vm.isLoading = false;
            }, error => {
                this.vm.isLoading = false;
            });

            this.populateParameterListWithStudentCustomField();

        });
    }

    populateParameterListWithStudentCustomField(): void {
        this.vm.data.studentParameterList.forEach(studentParameter => {
            this.vm.parameterList.push(StudentCustomParameterStructure.getStructure(
                studentParameter.id
            ));
        });
    }

    dataURLtoFile(dataurl, filename) {

        try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, {type: mime});
        } catch (e) {
            return null;
        }
    }

    createLayout(): void {
        this.vm.isLoading = true;
        const layout_data = { ...this.vm.currentLayout, content: JSON.stringify(this.vm.currentLayout.content) };
        const form_data = new FormData();
        Object.keys(layout_data).forEach(key => {
            if (key === 'background' ) {
                form_data.append(key, this.dataURLtoFile(layout_data[key], 'backgroundImage.jpeg'));
            } else {
                form_data.append(key, layout_data[key]);
            }
        });
        this.vm.reportCardService.createObject(this.vm.reportCardService.report_card_layout, form_data).then(idCardLayoutValue => {
            this.vm.reportCardLayoutList.push(idCardLayoutValue);
            this.vm.populateCurrentLayoutWithGivenValue(idCardLayoutValue);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    updateLayout(): void {
        this.vm.isLoading = true;
        const layout_data = { ...this.vm.currentLayout, content: JSON.stringify(this.vm.currentLayout.content) };
        const form_data = new FormData();
        Object.keys(layout_data).forEach(key => {
            if (key === 'background' ) {
                const file = this.dataURLtoFile(layout_data[key], 'backgroundImage.jpeg');
                if (file !== null) {
                    form_data.append(key, file);
                }
            } else {
                form_data.append(key, layout_data[key]);
            }
        });
        this.vm.reportCardService.partiallyUpdateObject(this.vm.reportCardService.report_card_layout, form_data).then(reportCardLayoutValue => {
            this.vm.reportCardLayoutList = this.vm.reportCardLayoutList.filter(item => {
                return item.id !== reportCardLayoutValue.id;
            });
            this.vm.reportCardLayoutList.push(reportCardLayoutValue);
            this.vm.populateCurrentLayoutWithGivenValue(reportCardLayoutValue);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    deleteLayout(): void {
        this.vm.isLoading = true;
        const layout_data = {
            id: this.vm.currentLayout.id,
        };
        this.vm.reportCardService.deleteObject(this.vm.reportCardService.report_card_layout, layout_data).then(value => {
            console.log(this.vm.reportCardLayoutList);
            this.vm.reportCardLayoutList = this.vm.reportCardLayoutList.filter(item => {
                return item.id !== layout_data.id;
            });
            console.log(this.vm.reportCardLayoutList);
            this.vm.currentLayout = null;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

}

