import {SendSmsComponent} from '@modules/sms/pages/send-sms/send-sms.component';
import {COMMON_VARIABLES, EMPLOYEE_VARIABLES, STUDENT_VARIABLES} from '@modules/sms/classes/constants';
import {isMobile} from '@classes/common';

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
                if (!COMMON_VARIABLES.some(x => x == variable)) {
                    let reg = new RegExp('@' + variable, 'g');
                    this.vm.message = this.vm.message.replace(reg, '@employeeName');
                }
            });
        }
    }

    isTemplateModified() {
        //.replace(/\r\n?|\n/g, '"\n"');
        let cont1 =  this.vm.message.replace(this.vm.variableRegex, '{#var#}');
        let cont2 = this.vm.userInput.selectedTemplate.rawContent.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
        return this.isSMSNeeded() && cont1 != cont2;
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
        this.vm.message = template.rawContent.replace(/{#var#}/g, defaultVariable).replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
        this.vm.userInput.selectedTemplate = template;
        let textArea = document.getElementById('messageBox');
        textArea.style.height = '0px';
        textArea.style.height = (textArea.scrollHeight + 30) + 'px';
    }

    isSendDisabled() {
        let disabled = this.vm.getMobileNumberList('both').length == 0 || this.vm.message.length == 0;
        if (!disabled && this.isSMSNeeded()) {
            disabled = this.vm.backendData.smsBalance < this.getEstimatedSMSCount();
        }
        if (!disabled && this.isSMSNeeded()) {
            disabled = this.isTemplateModified();
        }
        return disabled;
    }

    getButtonText() {
        if (this.vm.userInput.selectedSentType.id == 2) {
            return 'Send ' + this.getEstimatedSMSCount() + ' SMS';
        }
        if (this.vm.userInput.selectedSentType.id == 3) {
            return 'Send ' + this.vm.getMobileNumberList('notification').length + ' notifications';
        }
        if (this.vm.userInput.selectedSentType.id == 4) {
            return 'Send ' + this.getEstimatedSMSCount() + ' SMS & '
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
            return STUDENT_VARIABLES.map(a => a.displayVariable);
        } else {
            return EMPLOYEE_VARIABLES.map(a => a.displayVariable);
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

    getSMSCount(message): number {
        if (this.vm.hasUnicode(message)) {
            return Math.ceil(message.length / 70);
        } else {
            return Math.ceil(message.length / 160);
        }
    }

    getEstimatedSMSCount = () => {
        let count = 0;
        if (this.vm.userInput.selectedSentType == this.vm.sentTypeList[1]) {
            return 0;
        }
        let person = this.vm.userInput.selectedSendTo == this.vm.sendToList[0] ? 'student' : 'employee';
        let variables = this.vm.userInput.selectedSendTo == this.vm.sendToList[0] ? STUDENT_VARIABLES : EMPLOYEE_VARIABLES;
        this.vm.getMobileNumberList('sms').forEach(studentOrEmployee => {
            count += this.getSMSCount(
                this.vm.studentMessageService.getMessageFromTemplate(this.vm.message,
                    this.vm.studentMessageService.getMappingData(variables, this.vm.dataForMapping, person, studentOrEmployee.id))
            );
        });
        return count;
    }
}