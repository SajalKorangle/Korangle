import { AddComplaintTypeComponent } from './add-complaint-type.component';
import { isMobile } from '@classes/common';

export class AddComplaintTypeHtmlRenderer {

    vm: AddComplaintTypeComponent;

    constructor() { }

    /* Initialize Renderer */
    initializeRenderer(vm: AddComplaintTypeComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

    /* Check Status Name Uniqueness */
    checkUniqueness() {
        let answer = true;
        this.vm.statusList.forEach((status) => {
            if (status.name.toString().trim() == this.vm.addStatusName.toString().trim()) {
                answer = false;
            }
        });
        return answer;
    }  // Ends: checkUniqueness()

    /* Check Complaint Type Name Uniqueness */
    checkTypeNameUniqueness() {
        let answer = true;
        this.vm.complaintTypeList.forEach((complaintType) => {
            if (complaintType.name.toString().trim() == this.vm.typeName.toString().trim() && complaintType.id != this.vm.editingComplaintTypeId) {
                answer = false;
            }
        });
        return answer;
    }  // Ends: checkTypeNameUniqueness()

    /* For mobile-browser */
    isMobileBrowser(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }  // Ends: isMobileBrowser()

    /* For mobile-application */
    isMobileApplication(): boolean {
        return isMobile();
    }  // Ends: isMobileApplication()
}
