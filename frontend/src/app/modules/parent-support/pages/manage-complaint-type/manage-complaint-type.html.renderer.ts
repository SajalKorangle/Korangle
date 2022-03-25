import { ManageComplaintTypeComponent } from './manage-complaint-type.component';

export class ManageComplaintTypeHtmlRenderer {

    vm: ManageComplaintTypeComponent;

    constructor() { }

    /* Initialize Renderer */
    initializeRenderer(vm: ManageComplaintTypeComponent): void {
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

    checkUniqueness() {
        let answer = true;
        this.vm.statusList.forEach((status) => {
            if (status.name.toString().trim() == this.vm.addStatusName.toString().trim()) {
                answer = false;
            }
        });
        return answer;
    }

    checkTypeNameUniqueness() {
        let answer = true;
        this.vm.complaintTypeList.forEach((complaintType) => {
            if (complaintType.name.toString().trim() == this.vm.typeName.toString().trim() && complaintType.id != this.vm.editingComplaintTypeId) {
                answer = false;
            }
        });
        return answer;
    }

     /* For mobile-browser */
    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }  // Ends: isMobile()
}
