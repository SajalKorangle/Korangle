import {ViewDefaultersComponent} from '@modules/fees/pages/view-defaulters/view-defaulters.component';
import {isMobile} from '../../../../classes/common.js';

export class ViewDefaultersHtmlRenderer {

    vm: ViewDefaultersComponent;

    constructor() {
    }

    initializeAdapter(vm: ViewDefaultersComponent): void {
        this.vm = vm;
    }

    getPlaceHolder() {
        if (this.vm.selectedSentType != this.vm.sentTypeList[1] &&
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
        this.vm.message = template.rawContent.replace(/{#var#}/g, '@studentName');
        this.vm.userInput.selectedTemplate = template;
    }

    isSendDisabled() {
        let disabled = this.vm.getEstimatedSMSCount() + this.vm.getEstimatedNotificationCount() == 0 || this.vm.message.length == 0;
        if (!disabled && this.vm.selectedSentType != this.vm.sentTypeList[1]) {
            disabled = this.vm.getEstimatedSMSCount() > this.vm.smsBalance;
            disabled = this.vm.message.replace(this.vm.variableRegex, '{#var#}') != this.vm.userInput.selectedTemplate.rawContent;
        }
        return disabled;
    }

    isTemplateModified() {
        return this.vm.selectedSentType != this.vm.sentTypeList[1] &&
            this.vm.message.replace(this.vm.variableRegex, '{#var#}') != this.vm.userInput.selectedTemplate.rawContent;
    }

    getButtonText() {
        if (this.vm.selectedSentType == this.vm.sentTypeList[0]) {
            return 'Send ' + this.vm.getEstimatedSMSCount() + ' SMS';
        }
        if (this.vm.selectedSentType == this.vm.sentTypeList[1]) {
            return 'Send ' + this.vm.getEstimatedNotificationCount() + ' notifications';
        }
        if (this.vm.selectedSentType == this.vm.sentTypeList[2]) {
            return 'Send ' + this.vm.getEstimatedSMSCount() + ' SMS & '
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

}