import {ViewDefaultersComponent} from '@modules/fees/pages/view-defaulters/view-defaulters.component';
import {isMobile} from '../../../../classes/common.js';
import {FIND_VARIABLE_REGEX, NEW_LINE_REGEX} from '@modules/classes/constants';
import moment = require('moment');

export class ViewDefaultersHtmlRenderer {

    vm: ViewDefaultersComponent;

    constructor() {
    }

    initializeAdapter(vm: ViewDefaultersComponent): void {
        this.vm = vm;
    }

    getPlaceHolder() {
        if (this.vm.userInput.selectedSendUpdateType.id != this.vm.SEND_UPDATE_NOTIFICATION_TYPE_DBID &&
            (!this.vm.userInput.selectedTemplate.id || !this.vm.message || this.vm.message.trim() == '')) {
            return 'Select a template from template List';
        } else {
            return 'Enter any message';
        }
    }

    getSMSIdName(template: any) {
        return this.vm.backendData.smsIdList.find(smsId => smsId.id == template.parentSMSId).smsId;
    }

    selectTemplate(template: any) {
        this.vm.populatedTemplateList.forEach(temp => temp.selected = false);
        template.selected = true;
        // studentName is the default variable whenever a template is selected
        this.vm.message = template.rawContent.replace(/{#var#}/g, '{#studentName#}').replace(NEW_LINE_REGEX, "\n");
        this.vm.userInput.selectedTemplate = template;
        let textArea = document.getElementById('messageBox');
        textArea.style.height = '0px';
        textArea.style.height = (textArea.scrollHeight + 30) + 'px';
    }

    isSendDisabled() {
        let disabled = this.vm.getEstimatedSMSCount() + this.vm.getEstimatedNotificationCount() == 0 || this.vm.message.length == 0;
        if (!disabled && this.vm.userInput.selectedSendUpdateType.id != this.vm.SEND_UPDATE_NOTIFICATION_TYPE_DBID) {
            disabled = this.vm.getEstimatedSMSCount() > this.vm.smsBalance;
            if (!disabled) {
                disabled = this.isTemplateModified();
            }
        }
        if (!disabled && this.vm.userInput.selectedSendUpdateType.id == this.vm.SEND_UPDATE_SMS_TYPE_DBID && this.vm.userInput.scheduleSMS) {
            disabled = !this.vm.userInput.scheduledDate || !this.vm.userInput.scheduledTime || this.checkDateTimeInvalid();
        }
        return disabled;
    }

    isTemplateModified() {
        return this.vm.userInput.selectedSendUpdateType.id != this.vm.SEND_UPDATE_NOTIFICATION_TYPE_DBID &&
            this.vm.message.replace(FIND_VARIABLE_REGEX, '{#var#}') !=  this.vm.userInput.selectedTemplate.rawContent.replace(NEW_LINE_REGEX, "\n");
    }

    getButtonText() {
        let text = this.vm.userInput.scheduleSMS ? 'Schedule ' : 'Send ';
        if (this.vm.userInput.selectedSendUpdateType.id == this.vm.SEND_UPDATE_SMS_TYPE_DBID) {
            return text + this.vm.getEstimatedSMSCount() + ' SMS';
        }
        if (this.vm.userInput.selectedSendUpdateType.id == this.vm.SEND_UPDATE_NOTIFICATION_TYPE_DBID) {
            return text + this.vm.getEstimatedNotificationCount() + ' notifications';
        }
        if (this.vm.userInput.selectedSendUpdateType.id == this.vm.SEND_UPDATE_SMS_AND_NOTIFICATION_TYPE_DBID) {
            return text + this.vm.getEstimatedSMSCount() + ' SMS & '
                + this.vm.getEstimatedNotificationCount() + ' notifications';
        }
    }

    isMobile(): boolean {
        return isMobile();
    }

    hasPermission(): boolean {
        let moduleIdx = this.vm.user.activeSchool.moduleList.findIndex((module) => module.path == 'fees');
        return this.vm.user.activeSchool.moduleList[moduleIdx].taskList.findIndex((task) => task.path == 'generate_fees_report') != -1;
    }

    policeNumberInput(event: any): boolean {
        let value = event.key;
        if (
            value !== '0' &&
            value !== '1' &&
            value !== '2' &&
            value !== '3' &&
            value !== '4' &&
            value !== '5' &&
            value !== '6' &&
            value !== '7' &&
            value !== '8' &&
            value !== '9'
        ) {
            return false;
        }
        return true;
    }

    getFilteredFilterValues(parameter: any): any {
        if (parameter.filterFilterValues === '') {
            return parameter.filterValues;
        }
        return parameter.filterValues.filter((x) => {
            return x.name.includes(parameter.filterFilterValues);
        });
    }

    selectAllHandler = () => {
        if (this.vm.selectedFilterType == this.vm.filterTypeList[0]) {
            this.vm.getFilteredStudentList().forEach((item) => {
                item.selected = true;
            });
        } else {
            this.vm.getFilteredParentList().forEach((item) => {
                item.selected = true;
            });
        }
    }

    clearAllHandler = () => {
        if (this.vm.selectedFilterType == this.vm.filterTypeList[0]) {
            this.vm.getFilteredStudentList().forEach((item) => {
                item.selected = false;
            });
        } else {
            this.vm.getFilteredParentList().forEach((item) => {
                item.selected = false;
            });
        }
    }

    getFilteredParentFeesDueOverall(): any {
        return this.vm.getFilteredParentList().reduce((total, parent) => {
            return (
                total +
                parent.studentList.reduce((total, student) => {
                    return total + student['feesDueOverall'];
                }, 0)
            );
        }, 0);
    }

    getFilteredParentListFeesDueTillMonth(): any {
        return this.vm.getFilteredParentList().reduce((total, parent) => {
            return total + this.vm.getParentFeesDueTillMonth(parent);
        }, 0);
    }


    getFilteredParentTotalFees(): any {
        return this.vm.getFilteredParentList().reduce((total, parent) => {
            return (
                total +
                parent.studentList.reduce((total, student) => {
                    return total + student['totalFeesThisSession'];
                }, 0)
            );
        }, 0);
    }

    getFilteredParentTotalDiscount(): any {
        return this.vm.getFilteredParentList().reduce((total, parent) => {
            return (
                total +
                parent.studentList.reduce((total, student) => {
                    return total + student['discountThisSession'];
                }, 0)
            );
        }, 0);
    }

    getFilteredParentTotalFeesPaid(): any {
        return this.vm.getFilteredParentList().reduce((total, parent) => {
            return (
                total +
                parent.studentList.reduce((total, student) => {
                    return total + student['feesPaidThisSession'];
                }, 0)
            );
        }, 0);
    }

    getFilteredStudentListTotalFeesDueTillMonth(): any {
        return this.vm.getFilteredStudentList().reduce((total, student) => {
            return total + student['feesDueTillMonth'];
        }, 0);
    }

    getFilteredStudentListTotalFeesDue(): any {
        return this.vm.getFilteredStudentList().reduce((total, student) => {
            return total + student['feesDueOverall'];
        }, 0);
    }

    getFilteredStudentListTotalFeesDemand(): any {
        return this.vm.getFilteredStudentList().reduce((total, student) => {
            return total + student['totalFeesThisSession'];
        }, 0);
    }

    getFilteredStudentListTotalFeesPaid(): any {
        return this.vm.getFilteredStudentList().reduce((total, student) => {
            return total + student['feesPaidThisSession'];
        }, 0);
    }

    getFilteredStudentListTotalDiscount(): any {
        return this.vm.getFilteredStudentList().reduce((total, student) => {
            return total + student['discountThisSession'];
        }, 0);
    }

    downloadFeesReport(): void {
        if (this.vm.selectedFilterType == this.vm.filterTypeList[0]) {
            this.vm.downloadStudentFeesReport();
        } else {
            this.vm.downloadParentFeesReport();
        }
    }

    getSelectedParentCount = () => {
        return this.vm.getFilteredParentList().filter((item) => {
            return item.selected && item.selected == true;
        }).length;
    }

    getSelectedChildrenCount = () => {
        return this.vm.getFilteredStudentList().filter((item) => item.selected).length;
    }

    getMessageLength = () => {
        return this.vm.message.length;
    }

    getNumberOfMobileDevice = () => {
        if (this.vm.selectedFilterType == this.vm.filterTypeList[0]) {
            return this.vm.getFilteredStudentList().filter((item) => {
                return item.mobileNumber && item.selected;
            }).length;
        } else {
            return this.vm.getFilteredParentList().filter((item) => {
                return item.mobileNumber && item.selected;
            }).length;
        }
    }

    getVariables() {
       return  this.vm.defaultersPageVariables.map(x => x.displayVariable);
    }

    sendUpdateTypeChanged() {
        if (this.vm.userInput.selectedSendUpdateType.id != this.vm.SEND_UPDATE_NOTIFICATION_TYPE_DBID) {
            this.vm.message = '';
        }
        this.vm.userInput.scheduleSMS = false;
    }

    checkDateTimeInvalid() {
        if (this.vm.userInput.scheduledDate && this.vm.userInput.scheduledTime) {
            let selectedDateTime = moment(this.vm.userInput.scheduledDate + ' ' + this.vm.userInput.scheduledTime);
            let dateNow = moment();
            return selectedDateTime < dateNow;
        }
        return false;
    }

    getPerStudentSMSCount() {
        let personList = [];
        if (this.vm.selectedFilterType == this.vm.filterTypeList[0]) {
            personList = this.vm.getFilteredStudentList().filter((item) => item.mobileNumber && item.selected);
        } else {
            this.vm.getFilteredParentList().filter((item) => item.mobileNumber && item.selected).forEach(parent =>
                parent.studentList.forEach(student => personList.push(student)));
        }
        let estimatedCount = Number(this.vm.getEstimatedSMSCount());
        if (this.vm.userInput.selectedSendUpdateType.id == this.vm.SEND_UPDATE_SMS_AND_NOTIFICATION_TYPE_DBID) {
            personList = personList.filter(x => !x.notification);
        }
        let count2 = Number(personList.length);
        return isNaN(Math.round( estimatedCount / count2 )) ? 0 : Math.round( estimatedCount / count2 ) ;
    }

    isTemplateSelected(template: any) {
        let cont1 = this.vm.message.replace(FIND_VARIABLE_REGEX, '{#var#}');
        let cont2 = template.rawContent.replace(NEW_LINE_REGEX, '\n');
        return template.selected && cont1 == cont2;
    }
}