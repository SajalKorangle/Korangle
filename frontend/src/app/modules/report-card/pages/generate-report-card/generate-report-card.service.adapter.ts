import {GenerateReportCardComponent} from './generate-report-card.component'

export class GenerateReportCardServiceAdapter {

    vm: GenerateReportCardComponent

    constructor() {}

    // Data

    initializeAdapter(vm: GenerateReportCardComponent): void {
        this.vm = vm
    }

    // initialize data
    initializeData(): void {
        this.vm.isLoading = true
        const fetch_student_data = {
            parentSchool: this.vm.user.activeSchool.dbId
        };
        const fetch_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId
        };
        const fetch_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId
        };
        const student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const student_parameter_value_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
        };
        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student, fetch_student_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, fetch_student_section_data),
            this.vm.reportCardService.getObjectList(this.vm.reportCardService.report_card_layout, fetch_layouts_data),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, student_parameter_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, student_parameter_value_data),
        ]).then(data => {
            this.vm.classList = data[0];
            this.vm.sectionList = data[1];
            this.vm.studentList = data[2];
            this.vm.studentSectionList = data[3];
            this.vm.populateClassSectionList(data[0], data[1]);
            this.vm.layoutList = data[4];
            this.vm.sessionList = data[5];
            this.vm.studentParameterList = data[6];
            this.vm.studentParameterValueList = data[7];
            this.vm.isLoading = false
        }, error => {
            this.vm.isLoading = false
        })
    }

}
