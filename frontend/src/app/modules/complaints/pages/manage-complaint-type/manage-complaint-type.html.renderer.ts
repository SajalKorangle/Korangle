import { ManageComplaintTypeComponent } from './manage-complaint-type.component';
import { isMobile } from '@classes/common';

export class ManageComplaintTypeHtmlRenderer {

    vm: ManageComplaintTypeComponent;

    constructor() { }

    /* Initialize Renderer */
    initializeRenderer(vm: ManageComplaintTypeComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

    /* Check Complaint-Type Uniquness */
    checkTypeNameUniqueness() {
        let answer = true;
        this.vm.complaintTypeList.forEach((complaintType) => {
            if (complaintType.name.toString().trim() == this.vm.typeName.toString().trim() && complaintType.id != this.vm.editingComplaintTypeId) {
                answer = false;
            }
        });
        return answer;
    }  // Ends: checkTypeNameUniqueness()
}
