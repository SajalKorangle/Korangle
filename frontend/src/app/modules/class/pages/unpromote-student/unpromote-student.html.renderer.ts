import { UnpromoteStudentComponent } from './unpromote-student.component';

export class UnpromoteStudentHtmlRenderer {
    vm: UnpromoteStudentComponent;

    constructor() {}

    initializeRenderer(vm: UnpromoteStudentComponent): void {
        this.vm = vm;
    }

    isStudentDeletableFromSession(): boolean {

        // Checking if student is already deleted from this session or not
        this.vm.selectedStudentDeleteDisabledReason["isDeleted"] = this.vm.selectedStudent.isDeleted;

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