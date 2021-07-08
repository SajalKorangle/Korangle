import {ViewDefaultersComponent} from './view-defaulters.component';
import moment = require('moment');

export class ViewDefaultersServiceAdapter {
    vm: ViewDefaultersComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ViewDefaultersComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isLoading = true;

        const firstValue = await Promise.all([this.vm.smsService.getObjectList(this.vm.smsService.sms_id_school,
            {parentSchool: this.vm.user.activeSchool.dbId}), //0
            this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, {SMSEventId: this.vm.NOTIFY_DEFAULTERS_ID}), //1
            this.vm.smsService.getObject(this.vm.smsService.sms_event, {id: this.vm.NOTIFY_DEFAULTERS_ID}), //2
            this.vm.informationService.getObjectList(this.vm.informationService.send_update_type, {})]); //3

        this.vm.backendData.smsIdSchoolList = firstValue[0];
        this.vm.backendData.eventSettingsList = firstValue[1];
        this.vm.backendData.defaultersSMSEvent = firstValue[2];
        this.vm.backendData.sendUpdateTypeList = firstValue[3].filter(x => x.name != "NULL");
        this.vm.userInput.selectedSendUpdateType = this.vm.backendData.sendUpdateTypeList[0];

        this.vm.backendData.smsIdList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id, {
            id__in: this.vm.backendData.smsIdSchoolList.map(a => a.parentSMSId),
            smsIdStatus: 'ACTIVATED'
        });
        this.vm.backendData.templateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_template, {
            id__in: this.vm.backendData.eventSettingsList.map(a => a.parentSMSTemplate),
            'korangle__order': '-id',
        });

        this.populateTemplateList();

        const feeTypeList = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_section_list = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentTransferCertificate: 'null__korangle',
        };

        Promise.all([
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, {
                parentSchool: this.vm.user.activeSchool.dbId,
                parameterType: 'FILTER',
            }),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, {
                parentStudentParameter__parentSchool: this.vm.user.activeSchool.dbId,
                parentStudentParamter__parameterType: 'FILTER',
            }),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, feeTypeList),
        ]).then((val) => {
            let sessionList = val[0];
            this.vm.sessionList = sessionList;
            this.vm.studentParameterList = val[1].map((x) => ({
                ...x,
                filterValues: JSON.parse(x.filterValues).map((x) => ({ name: x, show: false })),
                showNone: false,
                filterFilterValues: '',
            }));
            this.vm.studentParameterValueList = val[2];
            const todaysDate = new Date();
            this.vm.currentSession = this.vm.sessionList.find((session) => {
                return (
                    new Date(session.startDate) <= todaysDate &&
                    new Date(new Date(session.endDate).getTime() + 24 * 60 * 60 * 1000) > todaysDate
                );
            });
            this.vm.feeTypeList = val[3];
        });

        this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list).then(
            (valueList) => {
                this.vm.studentSectionList = valueList;

                this.vm.dataForMapping['studentSectionList'] = valueList;

                const tempStudentIdList = valueList.map((a) => a.parentStudent);

                const iterationCount = Math.ceil(tempStudentIdList.length / this.vm.STUDENT_LIMITER);

                const service_list = [];

                const sms_count_request_data = {
                    parentSchool: this.vm.user.activeSchool.dbId,
                };

                service_list.push(this.vm.classService.getObjectList(this.vm.classService.classs, {}));
                service_list.push(this.vm.classService.getObjectList(this.vm.classService.division, {}));
                service_list.push(this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt));

                let loopVariable = 0;
                while (loopVariable < iterationCount) {
                    const student_list = {
                        id__in: tempStudentIdList
                            .slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1))
                            .join(),
                        fields__korangle: 'id,name,fathersName,mobileNumber,secondMobileNumber,address,scholarNumber',
                    };

                    const student_fee_list = {
                        parentSession__or: this.vm.user.activeSchool.currentSessionDbId,
                        cleared: 'false__boolean',
                        parentStudent__in: tempStudentIdList
                            .slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1))
                            .join(),
                    };

                    const sub_fee_receipt_list = {
                        parentStudentFee__parentSession__or: this.vm.user.activeSchool.currentSessionDbId,
                        parentStudentFee__cleared: 'false__boolean',
                        parentStudentFee__parentStudent__in: tempStudentIdList
                            .slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1))
                            .join(),
                        parentFeeReceipt__cancelled: 'false__boolean',
                    };

                    const sub_discount_list = {
                        parentStudentFee__parentSession__or: this.vm.user.activeSchool.currentSessionDbId,
                        parentStudentFee__cleared: 'false__boolean',
                        parentStudentFee__parentStudent__in: tempStudentIdList
                            .slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1))
                            .join(),
                        parentDiscount__cancelled: 'false__boolean',
                    };
                    service_list.push(this.vm.studentService.getObjectList(this.vm.studentService.student, student_list));
                    service_list.push(this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_list));
                    service_list.push(this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list));
                    service_list.push(this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list));

                    loopVariable = loopVariable + 1;
                }

                Promise.all(service_list).then(
                    (value) => {
                        this.vm.classList = value[0];
                        this.vm.sectionList = value[1];
                        this.vm.smsBalance = value[2].count;

                        this.vm.dataForMapping['classList'] = value[0];
                        this.vm.dataForMapping['divisionList'] = value[1];
                        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

                        this.vm.studentList = [];
                        this.vm.studentFeeList = [];
                        this.vm.subFeeReceiptList = [];
                        this.vm.subDiscountList = [];

                        let remaining_result = value.slice(3);

                        let loopVariable = 0;
                        while (loopVariable < iterationCount) {
                            this.vm.studentList = this.vm.studentList.concat(remaining_result[loopVariable * 4]);
                            this.vm.studentFeeList = this.vm.studentFeeList.concat(remaining_result[loopVariable * 4 + 1]);
                            this.vm.subFeeReceiptList = this.vm.subFeeReceiptList.concat(remaining_result[loopVariable * 4 + 2]);
                            this.vm.subDiscountList = this.vm.subDiscountList.concat(remaining_result[loopVariable * 4 + 3]);
                            loopVariable = loopVariable + 1;
                        }

                        this.vm.messageService.fetchGCMDevicesNew(this.vm.studentList);
                        this.vm.handleLoading();
                        this.vm.selectedFilterType = this.vm.filterTypeList[0];
                        this.vm.isLoading = false;
                    },
                    (error) => {
                        this.vm.isLoading = false;
                    }
                );
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateTemplateList(): void {
        this.vm.populatedTemplateList = this.vm.backendData.templateList;
        this.vm.populatedTemplateList.forEach(template => {
            template['selected'] = false;
        });
    }

    async sendSMSNotificationDefaulter() {
        if (this.vm.getEstimatedSMSCount() > 0 &&
            !confirm('Please confirm that you are sending ' + (this.vm.userInput.scheduleSMS ? 'Scheduling ' : 'Sending ') + this.vm.getEstimatedSMSCount() + ' SMS.')) {
            return;
        }
        this.vm.isLoading = true;
        let studentData = [];
        if (this.vm.selectedFilterType == this.vm.filterTypeList[0]) {
            studentData = this.vm.getFilteredStudentList().filter((item) => item.mobileNumber && item.selected);
        } else {
            this.vm.getFilteredParentList().forEach((parent) => {
                if (parent.selected && parent.mobileNumber) {
                    parent.studentList.forEach(student => {
                        studentData.push(student);
                    });
                }
            });
        }

        let scheduledDataTime = null;
        if (this.vm.userInput.scheduleSMS && this.vm.userInput.scheduledDate && this.vm.userInput.scheduledDate) {
            scheduledDataTime = moment(this.vm.userInput.scheduledDate + ' ' + this.vm.userInput.scheduledTime).format('YYYY-MM-DD HH:mm');
        }
        this.vm.dataForMapping['studentList'] = studentData;
        try {
           this.vm.smsBalance = await this.vm.messageService.smsNotificationSender(
                this.vm.dataForMapping,
                ['student'],
                this.vm.backendData.defaultersSMSEvent,
                this.vm.userInput.selectedSendUpdateType.id,
                this.vm.userInput.selectedTemplate,
                this.vm.message,
                scheduledDataTime,
                this.vm.user.activeSchool.dbId,
                this.vm.smsBalance
            );
        }catch (exception) {
            console.error(exception);
            alert('SMS Failed Try again');
            this.vm.isLoading = false;
            return;
        }
        alert(this.vm.userInput.selectedSendUpdateType.name + (this.vm.userInput.scheduleSMS ? ' Scheduled' : ' Sent') + ' Sent Successfully');
        this.vm.isLoading = false;
    }
}
