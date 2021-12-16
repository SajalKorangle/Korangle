import { UnpromoteStudentComponent } from './unpromote-student.component';
import { Query } from '../../../../services/generic/query';

export class UnpromoteStudentServiceAdapter {
    vm: UnpromoteStudentComponent;

    constructor() {}

    initializeAdapter(vm: UnpromoteStudentComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {}

    async getStudentDetails(selectedList: any): Promise<any> {
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
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                cancelled: 'False',
            })
            .getObjectList({ fees_third_app: 'FeeReceipt' });
            
        const discountQuery = new Query()
            .filter({ 
                parentStudent: studentList[0].id,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
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

        let tempStudentList;
        
        [
            tempStudentList,
            this.vm.selectedStudentSectionList,
            this.vm.selectedStudentFeeReceiptList,
            this.vm.selectedStudentDiscountList,
            this.vm.tcList

        ] = await Promise.all([
            studentQuery,   // 0
            studentSectionQuery,    // 1
            feeReceiptQuery,    // 2
            discountQuery,  // 3  
            transferCertificateNewQuery // 4
        ])

        this.vm.selectedStudent = studentList[0];
        Object.keys(tempStudentList).forEach((key) => {
            this.vm.selectedStudent[key] = tempStudentList[key];
        });

        this.vm.isLoading = false;
    }

    async deleteStudentFromSession(): Promise<any> {

        if(!this.vm.isStudentDeletableFromSession()) {
            return;
        }

        if (!confirm('Are you sure, you want to delete this student from the current session?')) {
            return;
        }

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

        await Promise.all([
            studentSubjectQuery,
            studentTestQuery,
            studentExtraSubFieldQuery,
            cceMarksQuery,
            studentFeeQuery,
            studentSectionQuery
        ])

        this.vm.selectedStudent.isDeleted = true;

        this.vm.isLoading = false;
    }
}