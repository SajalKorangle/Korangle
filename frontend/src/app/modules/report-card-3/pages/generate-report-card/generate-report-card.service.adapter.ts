import { GenerateReportCardComponent } from './generate-report-card.component';
import { StudentCustomParameterStructure } from './../../class/constants_3';

const MAX_LENGTH_OF_GET_REQUEST = 900;

export class GenerateReportCardServiceAdapter {
    vm: GenerateReportCardComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: GenerateReportCardComponent): void {
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
        this.vm.isLoading = true;
        Promise.all([
            this.vm.reportCardService.getObjectList(this.vm.reportCardService.report_card_layout_new, report_card_layouts_data), // 0
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: request_student_section_data}), // 1
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 2
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 3
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 4
        ])
            .then((data) => {
                this.vm.reportCardLayoutList = data[0];
                this.vm.studentSectionList = data[1];
                this.vm.classList = data[2];
                this.vm.divisionList = data[3];
                this.vm.DATA.data.classList = data[2];
                this.vm.DATA.data.divisionList = data[3];
                this.vm.DATA.data.sessionList = data[4];

                const service_list = [];

                const studentIdList = this.vm.studentSectionList.map((item) => item.parentStudent);
                const studentIdChunkList = [];
                for (let i = 0; i < studentIdList.length;) {
                    // dividing big id list to smaller chunks until request is satasfiable
                    const chunk = [];
                    while (chunk.join(',').length < MAX_LENGTH_OF_GET_REQUEST && i < studentIdList.length) {
                        chunk.push(studentIdList[i]);
                        i++;
                    }
                    studentIdChunkList.push(chunk);
                }
                studentIdChunkList.forEach((idChunk) => {
                    // requesting students for eahc chunk
                    const request_student_data = {
                        id__in: idChunk,
                    };
                    service_list.push(this.vm.genericService.getObjectList({student_app: 'Student'}, {filter: request_student_data}));
                });

                Promise.all(service_list).then(
                    (value) => {
                        this.vm.studentList = [];
                        value.forEach((studenkChunk) => this.vm.studentList.push(...studenkChunk));
                        this.vm.populateClassSectionList(this.vm.classList, this.vm.divisionList);
                        this.vm.isLoading = false;
                    },
                    (error) => {
                        this.vm.isLoading = false;
                    }
                );
            })
            .catch((err) => {
                this.vm.isLoading = false;
            });
    }

    getDataForGeneratingeportCard() {
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

        const request_class_signature_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        // this.vm.isLoading = true;
        return Promise.all([
            this.vm.genericService.getObjectList({student_app: 'StudentParameter'}, {filter: request_student_parameter_data}), // 0
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data), // 1
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_test_data), // 2
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), // 3
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 4
            this.vm.gradeService.getObjectList(this.vm.gradeService.grade, request_grade_data), // 5
            this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grade, request_sub_grade_data), // 6
            this.vm.classService.getObjectList(this.vm.classService.class_teacher_signature, request_class_signature_data), //7
        ])
            .then(async (data) => {
                this.vm.DATA.data.studentParameterList = data[0];
                this.vm.DATA.data.examinationList = data[1];
                this.vm.DATA.data.testList = data[2];
                this.vm.DATA.data.subjectList = data[3];
                this.vm.DATA.data.sessionList = data[4];
                this.vm.DATA.data.gradeList = data[5];
                this.vm.DATA.data.subGradeList = data[6];
                this.vm.DATA.data.classSectionSignatureList = data[7];

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
                    parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent).join(','),
                };
                const request_student_examination_remarks_data = {
                    parentExamination__parentSchool: this.vm.user.activeSchool.dbId,
                    parentExamination__parentSession: this.vm.user.activeSchool.currentSessionDbId,
                    parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent).join(','),
                };

                await Promise.all([
                    this.vm.genericService.getObjectList({student_app: 'StudentParameterValue'}, {filter: request_student_parameter_value_data}), // 0
                    this.vm.genericService.getObjectList({examination_app: 'StudentTest'}, {filter: request_student_test_data}), // 1
                    this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, request_attendance_data), // 2
                    this.vm.gradeService.getObjectList(this.vm.gradeService.student_sub_grade, request_student_sub_grade_data), // 3
                    this.vm.examinationService.getObjectList(
                        this.vm.examinationService.student_examination_remarks,
                        request_student_examination_remarks_data
                    ), // 4
                ]).then(
                    (value) => {
                        this.vm.DATA.data.studentParameterValueList = value[0];
                        this.vm.DATA.data.studentTestList = value[1];
                        this.vm.DATA.data.attendanceList = value[2];
                        this.vm.DATA.data.studentSubGradeList = value[3];
                        this.vm.DATA.data.studentExaminationRemarksList = value[4];
                    },
                    (error) => { }
                );
                this.populateParameterListWithStudentCustomField();
            })
            .catch((err) => { });
    }

    populateParameterListWithStudentCustomField(): void {
        this.vm.DATA.data.studentParameterList.forEach((studentParameter) => {
            this.vm.htmlAdapter.parameterList.push(
                StudentCustomParameterStructure.getStructure(studentParameter.name, studentParameter.id)
            );
        });
    }
}
