import {SendSmsComponent} from '@modules/sms/pages/send-sms/send-sms.component';
import {EMPLOYEE_VARIABLES, STUDENT_VARIABLES} from '@modules/sms/classes/constants';

export class SendSmsHtmlRenderer {

    vm: SendSmsComponent;

    constructor() {
    }

    initializeAdapter(vm: SendSmsComponent): void {
        this.vm = vm;
    }

    changeMessageContent() {
        if (this.vm.userInput.selectedSendTo == 'Students') {
            this.vm.message = this.vm.message.replace(/@employeeName/g, '@studentName');
        } else {
            STUDENT_VARIABLES.forEach(variable => {
                let reg = new RegExp('@' + variable, 'g');
                this.vm.message = this.vm.message.replace(reg, '@employeeName');
            });
        }
    }

    isTemplateModified() {
        return this.isSMSNeeded() && this.vm.message.replace(this.vm.variableRegex, '{#var#}') != this.vm.userInput.selectedTemplate.rawContent;
    }

    isSMSNeeded() {
        return this.vm.userInput.selectedSentType.id != 3;
    }

    getSMSIdName(template: any) {
        return this.vm.backendData.smsIdList.find(smsId => smsId.id == template.parentSMSId).smsId;
    }

    selectTemplate(template: any) {
        this.vm.populatedTemplateList.forEach(temp => temp.selected = false);
        template.selected = true;
        let defaultVariable = this.vm.userInput.selectedSendTo == this.vm.sendToList[0] ? '@studentName' : '@employeeName';
        this.vm.message = template.rawContent.replace(/{#var#}/g, defaultVariable);
        this.vm.userInput.selectedTemplate = template;
    }

    isSendDisabled() {
        let disabled = this.vm.getMobileNumberList('both').length == 0 || this.vm.message.length == 0;
        if (!disabled && this.isSMSNeeded()) {
            disabled = this.vm.backendData.smsBalance < this.vm.getMobileNumberList('sms').length * this.getSMSCount();
            disabled = this.vm.message.replace(this.vm.variableRegex, '{#var#}') != this.vm.userInput.selectedTemplate.rawContent;
        }
        return disabled;
    }

    getButtonText() {
        if (this.vm.userInput.selectedSentType.id == 2) {
            return 'Send ' + this.vm.getMobileNumberList('sms').length * this.getSMSCount() + ' SMS';
        }
        if (this.vm.userInput.selectedSentType.id == 3) {
            return 'Send ' + this.vm.getMobileNumberList('notification').length + ' notifications';
        }
        if (this.vm.userInput.selectedSentType.id == 4) {
            return 'Send ' + this.vm.getMobileNumberList('sms').length * this.getSMSCount() + ' SMS & '
                + this.vm.getMobileNumberList('notification').length + ' notifications';
        }
    }

    getPlaceHolder() {
        if (this.isSMSNeeded() && (!this.vm.userInput.selectedTemplate.id || !this.vm.message || this.vm.message.trim() == '')) {
            return 'Select a template from template List';
        } else {
            return 'Enter any message';
        }
    }

    getVariables() {
        if (this.vm.userInput.selectedSendTo == 'Students') {
            return STUDENT_VARIABLES;
        } else {
            return EMPLOYEE_VARIABLES;
        }
    }

    getClassSectionName(classId: number, sectionId: number): string {
        let classSection = this.vm.classSectionList.find((classSection) => {
            return classSection.class.id == classId && classSection.section.id == sectionId;
        });
        let multipleSections =
            this.vm.classSectionList.filter((classSection) => {
                return classSection.class.id == classId;
            }).length > 1;
        return classSection.class.name + (multipleSections ? ', ' + classSection.section.name : '');
    }


    selectAllEmployees(): void {
        this.vm.employeeList.forEach((employee) => {
            if (employee.validMobileNumber) {
                employee.selected = true;
            }
        });
    }

    unSelectAllEmployees(): void {
        this.vm.employeeList.forEach((employee) => {
            employee.selected = false;
        });
    }

    getSelectedStudentNumber = () => {
        // console.log(this.getFilteredStudentList().reduce((acc,x) => acc+x.selected?1:0, 0))
        return this.vm.getFilteredStudentList().reduce((acc, x) => {
            return x.selected ? acc + 1 : acc;
        }, 0);
    }

    getDisplayStudentNumber = () => this.vm.getFilteredStudentList().length;

    getSelectedEmployeeNumber(): number {
        let result = 0;
        this.vm.employeeList.forEach((employee) => {
            if (employee.selected) {
                ++result;
            }
        });
        return result;
    }

    unselectAllClasses(): void {
        this.vm.classSectionList.forEach((classSection) => {
            classSection['selected'] = false;
        });
    }

    selectAllClasses(): void {
        this.vm.classSectionList.forEach((classSection) => {
            classSection['selected'] = true;
        });
    }

    selectAllStudents(): void {
        this.vm.studentSectionList.forEach((studentSection) => {
            if (studentSection.validMobileNumber) {
                studentSection.selected = true;
            }
        });
    }

    unSelectAllStudents(): void {
        this.vm.studentSectionList.forEach((studentSection) => {
            studentSection.selected = false;
        });
    }

    getSMSCount(): number {
        if (this.vm.hasUnicode()) {
            return Math.ceil(this.vm.message.length / 70);
        } else {
            return Math.ceil(this.vm.message.length / 160);
        }
    }
}