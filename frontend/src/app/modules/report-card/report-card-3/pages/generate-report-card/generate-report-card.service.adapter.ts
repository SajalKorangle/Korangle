import { GenerateReportCardComponent } from './generate-report-card.component';
import { StudentCustomParameterStructure } from './../../../class/constants_3';

export class GenerateReportCardServiceAdapter {

    vm: GenerateReportCardComponent

    constructor() {}

    // Data

    initializeAdapter(vm: GenerateReportCardComponent): void {
        this.vm = vm
    }

    // initialize data
    initializeData(): void {
        const report_card_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId
        };
        const request_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };
        this.vm.isLoading = true;
        Promise.all([
            this.vm.reportCardService.getObjectList(this.vm.reportCardService.report_card_layout_new, report_card_layouts_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data), // 1\
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 2
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 3
        ]).then(data => { 
            this.vm.reportCardLayoutList = data[0];
            console.log('layouts = ', data[0]);
            this.vm.studentSectionList = data[1];
            this.vm.classList = data[2];
            this.vm.divisionList = data[3];
            this.vm.DATA.data.classList = data[2];
            this.vm.DATA.data.divisionList = data[3];

            const request_student_data = {
                id__in: this.vm.studentSectionList.map(item => item.parentStudent).join(','),
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data), // 0
            ]).then(value => {
                this.vm.studentList = value[0];
                this.vm.populateClassSectionList(this.vm.classList, this.vm.divisionList);
                this.vm.isLoading = false;
            }, error => {
                this.vm.isLoading = false;
            });
        }).catch(err => {
            this.vm.isLoading = false;
        })
    }

    getDataForGeneratingeportCard() {
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
        // this.vm.isLoading = true;
        return Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, request_student_parameter_data), // 0
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data), // 1
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_test_data), // 2
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), // 3
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 4
            this.vm.gradeService.getObjectList(this.vm.gradeService.grade, request_grade_data), // 5
            this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grade, request_sub_grade_data), // 6
        ]).then(data => { 
            this.vm.DATA.data.studentParameterList = data[0];
            this.vm.DATA.data.examinationList = data[1];
            this.vm.DATA.data.testList = data[2];
            this.vm.DATA.data.subjectList = data[3];
            this.vm.DATA.data.sessionList = data[4];
            this.vm.DATA.data.gradeList = data[5];
            this.vm.DATA.data.subGradeList = data[6];

            const request_student_parameter_value_data = {
                parentStudent__in: this.vm.DATA.data.studentSectionList.map(item => item.parentStudent).join(','),
            };
            const request_student_test_data = {
                parentStudent__in: this.vm.DATA.data.studentSectionList.map(item => item.parentStudent).join(','),
                parentExamination__in: this.vm.DATA.data.examinationList.map(item => item.id).join(','),
            };
            const request_attendance_data = {
                parentStudent__in: this.vm.DATA.data.studentSectionList.map(item => item.parentStudent).join(','),
                'dateOfAttendance__gte': (new Date(this.vm.DATA.data.sessionList.find(session => { return session.id === this.vm.user.activeSchool.currentSessionDbId}).startDate)).getFullYear() + '-01-01',
                'dateOfAttendance__lte': (new Date(this.vm.DATA.data.sessionList.find(session => { return session.id === this.vm.user.activeSchool.currentSessionDbId}).endDate)).getFullYear() + '-12-31',
            };
            const request_student_sub_grade_data = {
                parentStudent__in: this.vm.DATA.data.studentSectionList.map(item => item.parentStudent).join(','),
            };
            const request_student_examination_remarks_data = {
                parentExamination__parentSchool: this.vm.user.activeSchool.dbId,
                parentExamination__parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentStudent__in: this.vm.DATA.data.studentSectionList.map(item => item.parentStudent).join(','),
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, request_student_parameter_value_data), // 0
                this.vm.examinationService.getObjectList(this.vm.examinationService.student_test, request_student_test_data), // 1
                this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, request_attendance_data), // 2
                this.vm.gradeService.getObjectList(this.vm.gradeService.student_sub_grade, request_student_sub_grade_data), // 3
                this.vm.examinationService.getObjectList(this.vm.examinationService.student_examination_remarks, request_student_examination_remarks_data), // 4
            ]).then(value => {
                this.vm.DATA.data.studentParameterValueList = value[0];
                this.vm.DATA.data.studentTestList = value[1];
                this.vm.DATA.data.attendanceList = value[2];
                this.vm.DATA.data.studentSubGradeList = value[3];
                this.vm.DATA.data.studentExaminationRemarksList = value[4];
                console.log('DATA: ', this.vm.DATA);
                // this.vm.isLoading = false;
            }, error => {
                // this.vm.isLoading = false;
            });
            this.populateParameterListWithStudentCustomField();
        }).catch(err => {
            // this.vm.isLoading = false;
        })
    }

    populateParameterListWithStudentCustomField(): void {
        this.vm.DATA.data.studentParameterList.forEach(studentParameter => {
            this.vm.parameterList.push(StudentCustomParameterStructure.getStructure(
                studentParameter.name, studentParameter.id
            ));
        });
    }

}
