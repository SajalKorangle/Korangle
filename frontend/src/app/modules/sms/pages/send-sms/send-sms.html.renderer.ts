import {SendSmsComponent} from '@modules/sms/pages/send-sms/send-sms.component';
import {
    FIND_VARIABLE_REGEX,
    NEW_LINE_REGEX,
    VARIABLE_MAPPED_EVENT_LIST
} from '@modules/classes/constants';
import moment = require('moment');


export class SendSmsHtmlRenderer {

    vm: SendSmsComponent;

    constructor() {
    }

    initializeAdapter(vm: SendSmsComponent): void {
        this.vm = vm;
    }

    isTemplateModified() {
        if (this.isSMSNeeded() && Object.keys(this.vm.userInput.selectedTemplate).length != 0) {
            let cont1 = this.vm.message.replace(FIND_VARIABLE_REGEX, '{#var#}');
            let cont2 = this.vm.userInput.selectedTemplate.rawContent.replace(NEW_LINE_REGEX, '\n');
            return cont1 != cont2;
        }
        return false;
    }

    isSMSNeeded() {
        return this.vm.userInput.selectedSendUpdateType.id != this.vm.NOTIFICATION_TYPE_ID;
    }

    getSMSIdName(template: any) {
        return this.vm.backendData.smsIdList.find(smsId => smsId.id == template.parentSMSId).smsId;
    }

    selectTemplate(template: any) {
        this.vm.populatedTemplateList.forEach(temp => temp.selected = false);
        template.selected = true;
        let defaultVariable = this.vm.userInput.selectedSendTo.id == 1 ? '{#studentName#}' : '{#employeeName#}' ;
        if (this.vm.userInput.selectedSendTo.id == 3) {
            defaultVariable = '{#name#}';
        }
        this.vm.message = template.rawContent.replace(/{#var#}/g, defaultVariable).replace(NEW_LINE_REGEX, '\n');
        this.vm.userInput.selectedTemplate = template;
        let textArea = document.getElementById('messageBox');
        textArea.style.height = '0px';
        textArea.style.height = (textArea.scrollHeight + 30) + 'px';
    }

    isSendDisabled() {
        let disabled = this.vm.getMobileNumberList('both').length == 0 || this.vm.message.length == 0;
        if (!disabled && this.isSMSNeeded()) {
            disabled = this.vm.backendData.smsBalance < this.getEstimatedSMSCount() || this.isTemplateModified();
        }
        if (!disabled && this.vm.userInput.selectedSendUpdateType.id == this.vm.SMS_TYPE_ID && this.vm.userInput.scheduleSMS) {
            disabled = !this.vm.userInput.scheduledDate || !this.vm.userInput.scheduledTime || this.checkDateTimeInvalid();
        }
        return disabled;
    }

    getButtonText() {
        let text = this.vm.userInput.scheduleSMS ? 'Schedule ' : 'Send ';
        if (this.vm.userInput.selectedSendUpdateType.id == this.vm.SMS_TYPE_ID) {
            return text + this.getEstimatedSMSCount() + ' SMS';
        }
        if (this.vm.userInput.selectedSendUpdateType.id == this.vm.NOTIFICATION_TYPE_ID) {
            return text + this.vm.getMobileNumberList('notification').length + ' notifications';
        }
        if (this.vm.userInput.selectedSendUpdateType.id == this.vm.SMS_AND_NOTIFICATION_TYPE_ID) {
            return text + this.getEstimatedSMSCount() + ' SMS & '
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
            return VARIABLE_MAPPED_EVENT_LIST.find
            (vme => vme.eventId == this.vm.userInput.selectedSendTo.id).variableList.map(x => x.displayVariable);
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
        if (this.vm.userInput.selectedSendUpdateType.id == this.vm.NOTIFICATION_TYPE_ID) {
            return 0;
        }

        let variables = VARIABLE_MAPPED_EVENT_LIST.find(x => x.eventId == this.vm.userInput.selectedSendTo.id).variableList;
        this.vm.dataForMapping['studentList'] = this.vm.getFilteredStudentList().filter((x) => {
            return x.selected;
        }).map(a => a.student);
        this.vm.dataForMapping['employeeList'] = this.vm.employeeList.filter(x => x.selected);
        this.vm.dataForMapping['commonPersonList'] = this.vm.getMobileNumberList('sms');

        this.vm.getMobileNumberList('sms').forEach(anyPerson => {
            let personType = this.vm.personTypeListIndexedWithSendToId[this.vm.userInput.selectedSendTo.id];
            count += this.getSMSCount(
                this.vm.messageService.getMessageFromTemplate(this.vm.message,
                    this.vm.messageService.getMappingData(variables, this.vm.dataForMapping, personType, anyPerson))
            );
        });

        return count;
    }

    getPerStudentSMSCount() {
        let estimatedCount = Number(this.getEstimatedSMSCount());
        let count2 = Number(this.vm.getMobileNumberList('sms').length);
        return isNaN(Math.round( estimatedCount / count2 )) ? 0 : Math.round( estimatedCount / count2 ) ;
    }

    checkDateTimeInvalid() {
        if (this.vm.userInput.scheduledDate && this.vm.userInput.scheduledTime) {
            let selectedDateTime = moment(this.vm.userInput.scheduledDate + ' ' + this.vm.userInput.scheduledTime);
            let dateNow = moment();
            return selectedDateTime < dateNow;
        }
        return false;
    }

    getTemplateList() {
        let selectedEventSettingsList = this.vm.backendData.eventSettingList.filter(x => x.SMSEventId == this.vm.userInput.selectedSendTo.id);
        return this.vm.populatedTemplateList.filter(temp => selectedEventSettingsList.some(e => temp.id == e.parentSMSTemplate));
    }

    sendUpdateTypeChanged() {
        if (this.isSMSNeeded()) {
            this.vm.message = '';
        }
        this.vm.userInput.scheduleSMS = false;
    }

    isTemplateSelected(template: any) {
        let cont1 = this.vm.message.replace(FIND_VARIABLE_REGEX, '{#var#}');
        let cont2 = template.rawContent.replace(NEW_LINE_REGEX, '\n');
        return template.selected && cont1 == cont2;
    }
}