import { TCLogbookComponent } from './tc-logbook.component';

export class TCLogbookServiceAdapter {

    vm: TCLogbookComponent

    constructor(vm: TCLogbookComponent) {
        this.vm = vm;
    }
    
    initializeData() {
        this.vm.isLoading = true;

        const request_tc_data = {
            parentStudent__parentSession: this.vm.user.activeSchool.currentSessionDbId,
        }

        Promise.all([
            this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, request_tc_data),   // 0
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),    // 1
            this.vm.classService.getObjectList(this.vm.classService.division, {}),  // 2
        ]).then(data => {
            this.vm.tcList = data[0];
            this.vm.classList = data[1];
            this.vm.divisionList = data[2];

            const request_student_section_data = {
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentStudent__in: this.vm.tcList.map(tc=>tc.parentStudent).join(','),
            };

            const request_student_data = {
                id__in: this.vm.tcList.map(tc=>tc.parentStudent).join(','),
                fields__korangle: 'id,name,fathersName,scholarNumber',
            }
            const emp_ids = [];
            this.vm.tcList.forEach(tc => {
                emp_ids.push(tc.generatedBy);
                if (tc.issuedBy)
                    emp_ids.push(tc.issuedBy);
                if (tc.cancelledBy)
                    emp_ids.push(tc.cancelledBy);
            })
            const employee_request = {
                id__in: emp_ids.join(','),
                fields__korangle: 'id,name',
            }

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data), // 0
                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data), // 1
                this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_request),   // 2
            ]).then(value => {
                this.vm.studentSectionList = value[0];
                this.vm.studentList = value[1];
                this.vm.employeesList = value[2];
                this.vm.populateClassSectionList(data[1], data[2]);
                this.vm.populateStudentSectionWithTC();
                this.vm.selectAllClasses();
                this.vm.isLoading = false;
            })
        });
    }

}