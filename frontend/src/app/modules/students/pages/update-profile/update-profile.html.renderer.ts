import { UpdateProfileComponent } from './update-profile.component';

export class UpdateProfileHtmlRenderer {

    vm: UpdateProfileComponent;

    constructor() { }

    initializeRenderer(vm: UpdateProfileComponent): void {
        this.vm = vm;
    }

    getSchoolCurrentSessionName(): string {
        return this.vm.sessionList.find((session) => {
            return session.id == this.vm.user.activeSchool.currentSessionDbId;
        }).name;

        return '';
    }

    getParameterValue = (parameter) => {
        try {
            return this.vm.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id).value;
        } catch {
            return this.vm.NULL_CONSTANT;
        }
    }

    checkCustomFieldChanged = (parameter) => {
        const item = this.vm.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
        const old_item = this.vm.studentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
        if (!item && old_item) {
            return true;
        }
        return item && (!old_item || item.value !== old_item.value || item.document_value != old_item.document_value);
    }

    getClassName(): any {
        return this.vm.classList.find((classs) => {
            return this.vm.selectedStudentSection.parentClass == classs.id;
        }).name;
    }

    getSectionName(): any {
        return this.vm.sectionList.find((section) => {
            return this.vm.selectedStudentSection.parentDivision == section.id;
        }).name;
    }

    checkFieldChanged(selectedValue, currentValue): boolean {
        if (selectedValue !== currentValue && !(selectedValue == null && currentValue === '')) {
            return true;
        }
        return false;
    }

    checkLength(value: any) {
        if (value && value.toString().length > 0) {
            return true;
        }
        return false;
    }

    checkRight(value: any, rightValue: number) {
        if (value && value.toString().length === rightValue) {
            return true;
        }
        return false;
    }

    getParameterDocumentType(parameter) {
        try {
            let document_value = this.vm.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id)
                .document_value;
            if (document_value) {
                let document_name = this.vm.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id)
                    .document_name;
                let urlList = [];
                if (document_name) {
                    urlList = document_name.split('.');
                } else {
                    urlList = document_value.split('.');
                }
                let type = urlList[urlList.length - 1];
                if (type == 'pdf') {
                    return 'pdf';
                } else {
                    return 'img';
                }
            } else {
                return 'none';
            }
        } catch {
            return 'none';
        }
    }

    getIcon(parameter: any) {
        let src = '/assets/img/';
        switch (this.getParameterDocumentType(parameter)) {
            case 'none':
                return src + 'nofile.png';
            case 'img':
                return src + 'img.png';
            case 'pdf':
                return src + 'pdf.png';
        }
    }

    /* For mobile-browser */
    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }
}
