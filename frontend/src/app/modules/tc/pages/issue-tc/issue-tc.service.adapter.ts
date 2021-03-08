import { IssueTCComponent } from './issue-tc.component'

export class IssueTCServiceAdapter{

    vm: IssueTCComponent;
    
    constructor(vm: IssueTCComponent){
        this.vm = vm;
    }

    initilizeData() {
        this.vm.isLoading = true;

        const request_student_section_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data), // 0
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),    // 1
            this.vm.classService.getObjectList(this.vm.classService.division, {}),  // 2
        ]).then(data => {
            this.vm.studentSectionList = data[0];
            this.vm.classList = data[1];
            this.vm.divisionList = data[2];
            this.vm.populateClassSectionList(data[1], data[2]);

            const request_tc_data = {
                parentStudent__in: data[0].map(ss => ss.parentStudent).join(','),
                status: 'Generated'
            }

            const request_student_data = {
                id__in: data[0].map(ss => ss.parentStudent).join(','),
                fields__korangle: 'id,name,fathersName,scholarNumber',
            }

            Promise.all([
                this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, request_tc_data),   // 0
                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data), // 1
            ]).then(value => {
                this.vm.tcList = value[0];
                this.vm.studentList = value[1];
                this.vm.populateStudentSectionWithTC();
                this.vm.isLoading = false;
            })
        });
    }

}