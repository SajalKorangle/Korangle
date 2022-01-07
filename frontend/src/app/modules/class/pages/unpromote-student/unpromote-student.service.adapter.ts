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
            .setFields(...['motherName', 'scholarNumber', 'dateOfBirth', 'address', 'remark'])
            .getObject({ student_app: 'Student' });

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
        this.vm.selectedStudent['rollNumber'] = this.vm.selectedStudentSectionList[0].rollNumber;
        
        // Checking if the current session is not the latest one for the student (which means that this session is a middle session or not)
        this.vm.selectedStudentDeleteDisabledReason["isMiddleSession"] = this.vm.selectedStudentSectionList[this.vm.selectedStudentSectionList.length - 1].parentSession !=
                                                                    this.vm.user.activeSchool.currentSessionDbId;

        // Checking if the current session is the only session in which student is registered (If that's the case then student can't be deleted)                                                            
        this.vm.selectedStudentDeleteDisabledReason["hasOnlyOneSession"] = this.vm.selectedStudentSectionList.length == 1;
        
        // Checking if fee receipt is generated for the student in the current session which is not cancelled
        this.vm.selectedStudentDeleteDisabledReason["hasFeeReceipt"] = this.vm.selectedStudentFeeReceiptList.find((feeReceipt) => {
            return (
                feeReceipt.parentStudent == this.vm.selectedStudent.id &&
                feeReceipt.parentSession == this.vm.user.activeSchool.currentSessionDbId &&
                feeReceipt.cancelled == false
            );
        }) != undefined;

        // Checking if discount is generated for the student in the current session which is not cancelled
        this.vm.selectedStudentDeleteDisabledReason["hasDiscount"] = this.vm.selectedStudentDiscountList.find((discount) => {
            return (
                discount.parentStudent == this.vm.selectedStudent.id && 
                discount.parentSession == this.vm.user.activeSchool.currentSessionDbId &&
                discount.cancelled == false
            );
        }) != undefined;

        // Checking if any tc is generated for the student in the current session which is not cancelled
        this.vm.selectedStudentDeleteDisabledReason["hasTC"] = this.vm.tcList.find((tc) => {
            return (
                tc.parentStudent == this.vm.selectedStudent.id &&
                tc.parentSession == this.vm.user.activeSchool.currentSessionDbId &&
                tc.cancelledBy == null
            );
        }) != undefined

        this.vm.isLoading = false;
    }

    async deleteStudentFromSession(): Promise<any> {

        if(!this.vm.htmlRenderer.isStudentDeletableFromSession()) {
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

        const studentFeeReceiptQuery = new Query()
            .filter({
                parentStudent: this.vm.selectedStudent.id,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
            })
            .deleteObjectList({ fees_third_app: 'FeeReceipt' });
 
        const studentFeeQuery = new Query()
            .filter({
                parentStudent: this.vm.selectedStudent.id,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
            })
            .deleteObjectList({ fees_third_app: 'StudentFee' });

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
            studentFeeReceiptQuery,
            studentFeeQuery,
            studentSectionQuery
        ])

        this.vm.selectedStudent.isDeleted = true;

        this.vm.isLoading = false;
    }
}