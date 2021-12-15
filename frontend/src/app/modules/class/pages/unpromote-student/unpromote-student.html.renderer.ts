import { UnpromoteStudentComponent } from './unpromote-student.component';

export class UnpromoteStudentHtmlRenderer {
    vm: UnpromoteStudentComponent;

    constructor() {}

    initializeRenderer(vm: UnpromoteStudentComponent): void {
        this.vm = vm;
    }

    enableDeleteFromSession(): boolean {

        this.vm.selectedStudentDeleteDisabledReason["isDeleted"] = this.vm.selectedStudent.isDeleted;
        
        this.vm.selectedStudentDeleteDisabledReason["isMiddleSession"] = this.vm.selectedStudentSectionList[this.vm.selectedStudentSectionList.length - 1].parentSession !=
                                                                    this.vm.user.activeSchool.currentSessionDbId;

        this.vm.selectedStudentDeleteDisabledReason["hasOnlyOneSession"] = this.vm.selectedStudentSectionList.length == 1;
        
        this.vm.selectedStudentDeleteDisabledReason["hasFeeReceipt"] = this.vm.selectedStudentFeeReceiptList.find((feeReceipt) => {
            return (
                feeReceipt.parentStudent == this.vm.selectedStudent.id &&
                feeReceipt.parentSession == this.vm.user.activeSchool.currentSessionDbId &&
                feeReceipt.cancelled == false
            );
        }) != undefined;

        this.vm.selectedStudentDeleteDisabledReason["hasDiscount"] = this.vm.selectedStudentDiscountList.find((discount) => {
            return (
                discount.parentStudent == this.vm.selectedStudent.id && 
                discount.parentSession == this.vm.user.activeSchool.currentSessionDbId &&
                discount.cancelled == false
            );
        }) != undefined;

        this.vm.selectedStudentDeleteDisabledReason["hasTC"] = this.vm.tcList.find((tc) => {
            return (
                tc.parentStudent == this.vm.selectedStudent.id &&
                tc.cancelledBy == null
            );
        }) != undefined

        return (
            !this.vm.selectedStudentDeleteDisabledReason["isDeleted"] &&
            !this.vm.selectedStudentDeleteDisabledReason["isMiddleSession"] &&
            !this.vm.selectedStudentDeleteDisabledReason["hasOnlyOneSession"] &&
            !this.vm.selectedStudentDeleteDisabledReason["hasFeeReceipt"] &&
            !this.vm.selectedStudentDeleteDisabledReason["hasDiscount"] &&
            !this.vm.selectedStudentDeleteDisabledReason["hasTC"]
        );
    }

}