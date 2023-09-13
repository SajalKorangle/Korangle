import { IssueTCComponent } from './issue-tc.component';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';

export class IssueTCServiceAdapter {
    vm: IssueTCComponent;

    constructor(vm: IssueTCComponent) {
        this.vm = vm;
    }

    initializeData() {
        this.vm.isLoading = true;

        const request_tc_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            status: 'Generated',
        };

        Promise.all([
            this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, request_tc_data), // 0
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 1
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 2
        ]).then((data) => {
            this.vm.tcList = data[0];
            this.vm.classList = data[1];
            this.vm.divisionList = data[2];

            const request_student_section_data = {
                id__in: this.vm.tcList.map((tc) => tc.parentStudentSection),
            };

            const request_student_data = {
                id__in: this.vm.tcList.map((tc) => tc.parentStudent),
                fields__korangle: 'id,name,fathersName,scholarNumber,dateOfAdmission',
            };

            const student_fee_request = {
                parentStudent__in: this.vm.tcList.map((tc) => tc.parentStudent),
                cleared: 'False',
            };

            const sub_fee_receipts_request = {
                parentStudentFee__parentStudent__in: this.vm.tcList.map((tc) => tc.parentStudent),
                parentStudentFee__cleared: 'False',
            };

            const sub_discount_request = {
                parentStudentFee__parentStudent__in: this.vm.tcList.map((tc) => tc.parentStudent),
                parentStudentFee__cleared: 'False',
            };

            const library_issued_books_request = {
                filter: {
                    parentStudent__in: this.vm.tcList.map((tc) => tc.parentStudent),
                    depositTime: null
                },
                fields_list: ["parentStudent"]
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data), // 0
                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data), // 1
                this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_request), // 2
                this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipts_request), // 3
                this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_request), // 4
                this.vm.genericService.getObjectList({library_app: "BookIssueRecord"}, library_issued_books_request) //5
            ]).then((value) => {
                this.vm.studentSectionList = value[0];
                this.vm.studentList = value[1];
                this.vm.studentFeeList = value[2];
                this.vm.subFeeReciptList = value[3];
                this.vm.subDiscountList = value[4];
                this.vm.libraryStudentsWithBookIssuedList = value[5].map((record) => record.parentStudent);

                this.vm.populateClassSectionList(data[1], data[2]);
                this.vm.populateStudentSectionWithTC();
                this.vm.isLoading = false;
            });
        });
    }

    issueTC(tc: TransferCertificateNew): Promise<any> {
        const tc_data_to_update = {
            id: tc.id,
            status: 'Issued',
            issuedBy: this.vm.user.activeSchool.employeeId,
        };
        return this.vm.tcService.partiallyUpdateObject(this.vm.tcService.transfer_certificate, tc_data_to_update);
    }
}
