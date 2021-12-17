import { UnpromoteStudentComponent } from './unpromote-student.component';

export class UnpromoteStudentHtmlRenderer {
    vm: UnpromoteStudentComponent;

    constructor() {}

    initializeRenderer(vm: UnpromoteStudentComponent): void {
        this.vm = vm;
    }

    isStudentDeletableFromSession(): boolean {
     
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