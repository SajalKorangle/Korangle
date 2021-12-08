import { DemoteStudentComponent } from './demote-student.component';
import { Query } from '../../../../services/generic/query';

export class DemoteStudentServiceAdapter {
    vm: DemoteStudentComponent;

    constructor() {}

    initializeAdapter(vm: DemoteStudentComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {}

    getStudentDetails(selectedList: any): void {
        this.vm.isLoading = true;
        let studentList = selectedList[0];

        const studentQuery = new Query()
            .filter({
                id: studentList[0].id
            })
            .setFields(...['motherName', 'rollNumber', 'scholarNumber', 'dateOfBirth', 'address', 'remark'])
            .getObjectList({ student_app: 'Student' });

        const studentSectionQuery = new Query()
                .filter({ parentStudent: studentList[0].id })
                .getObjectList({ student_app: 'StudentSection' });        
                
        const feeReceiptQuery = new Query()
            .filter({ 
                parentStudent: studentList[0].id,
                cancelled: 'False',
            })
            .getObjectList({ fees_third_app: 'FeeReceipt' });
            
        const discountQuery = new Query()
            .filter({ 
            parentStudent: studentList[0].id,
            cancelled: 'False',
            })
            .getObjectList({ fees_third_app: 'Discount' });
        
        const transferCertificateNewQuery = new Query()
            .filter({
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                status__in: ['Generated', 'Issued'],
            })
            .getObjectList({ tc_app: 'TransferCertificateNew' });
            console.log(studentList[0]);


        Promise.all([
            studentQuery,
            studentSectionQuery,
            feeReceiptQuery,
            discountQuery,
            transferCertificateNewQuery
        ]).then(
            (value) => {
                // console.log(value);

                this.vm.selectedStudent = studentList[0];
                Object.keys(value[0]).forEach((key) => {
                    this.vm.selectedStudent[key] = value[0][key];
                });

                this.vm.selectedStudentSectionList = value[1];
                this.vm.selectedStudentFeeReceiptList = value[2];
                this.vm.selectedStudentDiscountList = value[3];
                this.vm.tcList = value[4];

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    deleteStudentFromSession(): void {

        if(!this.vm.enableDeleteFromSession()) {
            this.vm.isDeleteFromSessionEnabled = false;
            return;
        }

        if (!confirm('Are you sure, you want to delete this student from the current session')) {
            return;
        }

        this.vm.isDeleteFromSessionEnabled = true;

        const studentSubjectQuery = new Query()
            .filter({
                parentStudent: this.vm.selectedStudent.id,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
            })
            .deleteObjectList({ subject_app: 'StudentSubject' });

        const studentTestQuery = new Query()
            .filter({ 
                parentStudent: this.vm.selectedStudent.id,
                parentExamination__parentSession: this.vm.user.activeSchool.currentSessionDbId,
            })
            .deleteObjectList({ examination_app: 'StudentTest' });

        const studentExtraSubFieldQuery = new Query()
            .filter({
                parentStudent: this.vm.selectedStudent.id,
                parentExamination__parentSession: this.vm.user.activeSchool.currentSessionDbId,
            })
            .deleteObjectList({ examination_app: 'StudentExtraSubField' });
        
        const cceMarksQuery = new Query()
            .filter({
                parentStudent: this.vm.selectedStudent.id,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
            })
            .deleteObjectList({ examination_app: 'CCEMarks' });

        const studentFeeQuery = new Query()
            .filter({ 
                parentStudent: this.vm.selectedStudent.id,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
            })
            .deleteObjectList({ fees_third_app: 'FeeReceipt' });

        const studentSectionQuery = new Query()
            .filter({
                parentStudent: this.vm.selectedStudent.id,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
            })
            .deleteObjectList({ student_app: 'StudentSection' });

        this.vm.isLoading = true;

        Promise.all([
            studentSubjectQuery,
            studentTestQuery,
            studentExtraSubFieldQuery,
            cceMarksQuery,
            studentFeeQuery,
            studentSectionQuery
        ]).then(
            (value) => {
                // console.log(value);
                this.vm.selectedStudent['deleted'] = true;

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
