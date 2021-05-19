import {StudentPermissionComponent} from './student-permission.component';

export class StudentPermissionServiceAdapter {

    vm: StudentPermissionComponent;

    constructor() { }

    initialize(vm: StudentPermissionComponent): void {
        this.vm = vm;
    }

    async initilizeData(){
        this.vm.isLoading = true;
        const request_student_section_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        [this.vm.backendData.studentSectionList, this.vm.backendData.classList, this.vm.backendData.divisionList] 
            = await Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data), // 0
                this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 1
                this.vm.classService.getObjectList(this.vm.classService.division, {}), // 2
            ]);

        const request_student_data = {
            id__in: this.vm.backendData.studentSectionList.map(ss=> ss.parentStudent),
            fields__korangle: ['name', 'fathersName', 'mobileNumber']
        };

        this.vm.backendData.studentList = await this.vm.studentService.getObjectList(
            this.vm.studentService.student, request_student_data
        );

        this.vm.initilizeHTMLRenderedData();
        this.vm.isLoading = false;
    }

}
