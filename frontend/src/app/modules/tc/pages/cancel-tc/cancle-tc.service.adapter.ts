import { CancelTCComponent } from './cancel-tc.component';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';

export class CancelTCServiceAdapter {

    vm: CancelTCComponent;

    constructor(vm: CancelTCComponent) {
        this.vm = vm;
    }


    // initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        const request_tc_data = {
            parentStudent__parentSession: this.vm.user.activeSchool.currentSessionDbId,
            status__in: ['Generated', 'Issued'].join(','),
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
                parentStudent__id__in: this.vm.tcList.map(tc => tc.parentStudent),
            };

            const request_student_data = {
                id__in: this.vm.tcList.map(tc => tc.parentStudent),
                fields__korangle: 'id,name,fathersName,scholarNumber',
            }

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data), // 0
                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data), // 1
            ]).then(value => {
                this.vm.studentSectionList = value[0];
                this.vm.studentList = value[1];
                
                this.vm.populateClassSectionList(data[1], data[2]);
                this.vm.populateStudentSectionWithTC();
                this.vm.isLoading = false;
            })
        });
    }

    cancelTC(tc: TransferCertificateNew): Promise<any>{
        const tc_data_to_update = {
            id: tc.id,
            status: 'Cancelled',
            cancelledBy: this.vm.user.activeSchool.employeeId,
        }
        return this.vm.tcService.partiallyUpdateObject(this.vm.tcService.transfer_certificate, tc_data_to_update);
    }

}
