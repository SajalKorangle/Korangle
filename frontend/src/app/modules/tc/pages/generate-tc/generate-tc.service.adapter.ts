import { GenerateTCComponent} from './generate-tc.component';
import { StudentCustomParameterStructure } from './../../class/constants';

export class GenerateTCServiceAdapter {

    vm: GenerateTCComponent

    constructor() {}

    // Data

    initializeAdapter(vm: GenerateTCComponent): void {
        this.vm = vm
    }

    // initialize data
    initializeData(): void {
        this.vm.DATA.currentSession = this.vm.user.activeSchool.currentSessionDbId;
        const tc_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId
        };
        const request_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };
        this.vm.isLoading = true;
        Promise.all([
            this.vm.tcService.getObjectList(this.vm.tcService.tc_layout, tc_layouts_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data), // 1\
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 2
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 3
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 4
        ]).then(data => { 
            this.vm.tcLayoutList = data[0];
            this.vm.studentSectionList = data[1];
            this.vm.classList = data[2];
            this.vm.divisionList = data[3];
            this.vm.DATA.data.classList = data[2];
            this.vm.DATA.data.divisionList = data[3];
            this.vm.DATA.data.sessionList = data[4];

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

    getDataForGeneratingTC() {
        const request_student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        // this.vm.isLoading = true;
        return Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, request_student_parameter_data), // 0
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), // 1
        ]).then(async data => { 
            this.vm.DATA.data.studentParameterList = data[0];
            this.vm.DATA.data.subjectList = data[1];

            const request_student_parameter_value_data = {
                parentStudent__in: this.vm.DATA.data.studentSectionList.map(item => item.parentStudent).join(','),
            };
            const request_attendance_data = {
                parentStudent__in: this.vm.DATA.data.studentSectionList.map(item => item.parentStudent).join(','),
                'dateOfAttendance__gte': (new Date(this.vm.DATA.data.sessionList.find(session => { return session.id === this.vm.user.activeSchool.currentSessionDbId}).startDate)).getFullYear() + '-01-01',
                'dateOfAttendance__lte': (new Date(this.vm.DATA.data.sessionList.find(session => { return session.id === this.vm.user.activeSchool.currentSessionDbId}).endDate)).getFullYear() + '-12-31',
            };

            await Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, request_student_parameter_value_data), // 0
                this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, request_attendance_data), // 1
            ]).then(value => {
                this.vm.DATA.data.studentParameterValueList = value[0];
                this.vm.DATA.data.attendanceList = value[1];
            }, error => {
            });
            this.populateParameterListWithStudentCustomField();
        }).catch(err => {
        })
    }

    populateParameterListWithStudentCustomField(): void {
        this.vm.DATA.data.studentParameterList.forEach(studentParameter => {
            this.vm.htmlAdapter.parameterList.push(StudentCustomParameterStructure.getStructure(
                studentParameter.name, studentParameter.id
            ));
        });
    }

}
