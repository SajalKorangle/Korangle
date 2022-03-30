import { AddComplaintTypeComponent } from './add-complaint-type.component';
import { isMobile } from '@classes/common';

export class AddComplaintTypeHtmlRenderer {

    vm: AddComplaintTypeComponent;

    constructor() { }

    /* Initialize Renderer */
    initializeRenderer(vm: AddComplaintTypeComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

    /* Set Cancel Button Style */
    getCancelBtnStyle() {
        let color = "white";
        if (this.vm.user.activeSchool.secondaryThemeColor == "primary") {
            color = "#1976D2";
        } else if (this.vm.user.activeSchool.secondaryThemeColor == "warning") {
            color = "#FFC107";
        } else if (this.vm.user.activeSchool.secondaryThemeColor == "secondary") {
            color = "#424242";
        } else if (this.vm.user.activeSchool.secondaryThemeColor == "accent") {
            color = "#82B1FF";
        } else if (this.vm.user.activeSchool.secondaryThemeColor == "error") {
            color = "#FF5252";
        } else if (this.vm.user.activeSchool.secondaryThemeColor == "info") {
            color = "#2196F3";
        } else if (this.vm.user.activeSchool.secondaryThemeColor == "success") {
            color = "#4CAF50";
        }

        let style = {
            'border': '1.5px solid ' + color,
        };

        return style;
    }  // Ends: getCancelBtnStyle()

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
