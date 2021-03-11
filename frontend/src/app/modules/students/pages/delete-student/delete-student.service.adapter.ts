
import { DeleteStudentComponent } from "./delete-student.component";

export class DeleteStudentServiceAdapter {

    vm: DeleteStudentComponent;

    constructor() {}

    initializeAdapter(vm: DeleteStudentComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

    }

    getStudentDetails(selectedList: any): void {

        let studentList = selectedList[0];

        let student_data = {
            'id': studentList[0].id,
            'fields__korangle': 'motherName,rollNumber,scholarNumber,dateOfBirth,address,remark',
        };

        let tc_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId
        }

        let student_section_data = {
            'parentStudent': studentList[0].id,
        };

        let fee_receipt_data = {
            'parentStudent': studentList[0].id,
            'cancelled': 'false__boolean',
        };

        let discount_data = {
            'parentStudent': studentList[0].id,
            'cancelled': 'false__boolean',
        };

        console.log(studentList[0]);

        this.vm.isLoading = true;

        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student,student_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section,student_section_data),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts,fee_receipt_data),
            this.vm.feeService.getObjectList(this.vm.feeService.discounts, discount_data),
            this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, tc_data),   // 4
        ]).then(value => {

            console.log(value);

            this.vm.selectedStudent = studentList[0];
            Object.keys(value[0]).forEach(key => {
                this.vm.selectedStudent[key] = value[0][key];
            });

            this.vm.selectedStudentSectionList = value[1];
            this.vm.selectedStudentFeeReceiptList = value[2];
            this.vm.selectedStudentDiscountList = value[3];
            this.vm.tcList = value[4];

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    deleteStudent(): void {

        if(!confirm("Are you sure, you want to delete this student")) {
            return;
        }

        let student_data = {
            'id': this.vm.selectedStudent.id,
        };

        this.vm.isLoading = true;

        this.vm.studentService.deleteObject(this.vm.studentService.student,student_data).then(value => {

            this.vm.selectedStudent['deleted'] = true;

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        })

    }

    deleteStudentFromSession(): void {

        let student_subject_data = {
            'parentStudent': this.vm.selectedStudent.id,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_test_data = {
            'parentStudent': this.vm.selectedStudent.id,
            'parentExamination__parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_extra_sub_field_data = {
            'parentStudent': this.vm.selectedStudent.id,
            'parentExamination__parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let cceMarks_data = {
            'parentStudent': this.vm.selectedStudent.id,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_fee_data = {
            'parentStudent': this.vm.selectedStudent.id,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_section_data = {
            'parentStudent': this.vm.selectedStudent.id,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.subjectService.deleteObjectList(this.vm.subjectService.student_subject,student_subject_data),
            this.vm.examinationOldService.deleteObjectList(this.vm.examinationOldService.student_test,student_test_data),
            this.vm.examinationOldService.deleteObjectList(this.vm.examinationOldService.student_extra_sub_field,student_extra_sub_field_data),
            this.vm.examinationOldService.deleteObjectList(this.vm.examinationOldService.cce_marks,cceMarks_data),
            this.vm.feeService.deleteObjectList(this.vm.feeService.student_fees,student_fee_data),
            this.vm.studentService.deleteObjectList(this.vm.studentService.student_section,student_section_data),
        ]).then(value => {

            this.vm.selectedStudent['deleted'] = true;

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })

    }

}
