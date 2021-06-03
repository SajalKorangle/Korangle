import { ViewDefaultersComponent } from './view-defaulters.component';

export class ViewDefaultersServiceAdapter {
    vm: ViewDefaultersComponent;

    constructor() {}

    // Data
  

    initializeAdapter(vm: ViewDefaultersComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        
        const feeTypeList={
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
        };
        Promise.all
        ([  
            this.vm.feeService.getList(this.vm.feeService.fee_type,feeTypeList),
        ])
        .then((val)=>{
            this.vm.myFeeTypeList=val[0];
        });
        this.vm.isLoading = true;

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
        });

        this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list).then(
            (valueList) => {
                this.vm.studentSectionList = valueList;

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
                        fields__korangle: 'id,name,fathersName,mobileNumber,secondMobileNumber,address',
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

                        this.vm.studentList = [];
                        this.vm.studentFeeList = [];
                        this.vm.subFeeReceiptList = [];
                        this.vm.subDiscountList = [];

                        let remaining_result = value.slice(3);

                        let loopVariable = 0;
                        while (loopVariable < iterationCount) {
                            this.vm.studentList = this.vm.studentList.concat(remaining_result[loopVariable * 4]);
                            this.vm.studentFeeList = this.vm.studentFeeList.concat(remaining_result[loopVariable * 4 + 1]);
                            // this.vm.myStudentFeeList=this.vm.studentFeeList;
                            this.vm.subFeeReceiptList = this.vm.subFeeReceiptList.concat(remaining_result[loopVariable * 4 + 2]);
                            this.vm.subDiscountList = this.vm.subDiscountList.concat(remaining_result[loopVariable * 4 + 3]);
                            loopVariable = loopVariable + 1;
                        }

                        this.fetchGCMDevices(this.vm.studentList);
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

    fetchGCMDevices = (studentList) => {
        const service_list = [];
        const iterationCount = Math.ceil(studentList.length / this.vm.STUDENT_LIMITER);
        let loopVariable = 0;

        while (loopVariable < iterationCount) {
            const mobile_list = studentList.filter((item) => item.mobileNumber).map((obj) => obj.mobileNumber.toString());

            const gcm_data = {
                user__username__in: mobile_list.slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1)),
                active: 'true__boolean',
            };
            const user_data = {
                fields__korangle: 'username,id',
                username__in: mobile_list.slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1)),
            };

            service_list.push(this.vm.notificationService.getObjectList(this.vm.notificationService.gcm_device, gcm_data));
            service_list.push(this.vm.userService.getObjectList(this.vm.userService.user, user_data));

            loopVariable = loopVariable + 1;
        }

        Promise.all(service_list).then((value) => {
            let temp_gcm_list = [];
            let temp_user_list = [];
            let loopVariable = 0;
            while (loopVariable < iterationCount) {
                temp_gcm_list = temp_gcm_list.concat(value[loopVariable * 2]);
                temp_user_list = temp_user_list.concat(value[loopVariable * 2 + 1]);
                loopVariable = loopVariable + 1;
            }

            const notif_usernames = temp_user_list.filter((user) => {
                return (
                    temp_gcm_list.find((item) => {
                        return item.user == user.id;
                    }) != undefined
                );
            });
            // Storing because they're used later
            this.vm.notif_usernames = notif_usernames;

            let notification_list;

            notification_list = studentList.filter((obj) => {
                return (
                    notif_usernames.find((user) => {
                        return user.username == obj.mobileNumber;
                    }) != undefined
                );
            });
            studentList.forEach((item, i) => {
                item.notification = false;
            });
            notification_list.forEach((item, i) => {
                item.notification = true;
            });
            this.vm.handleLoading();
            this.vm.selectedFilterType = this.vm.filterTypeList[0];

            this.vm.isLoading = false;
        });
    }

    sendSMSNotificationDefaulter: any = (mobile_list: any, message: string) => {
        let service_list = [];
        let notification_list = [];
        let sms_list = [];
        if (this.vm.selectedSentType == this.vm.sentTypeList[0]) {
            sms_list = mobile_list;
            notification_list = [];
        } else if (this.vm.selectedSentType == this.vm.sentTypeList[1]) {
            sms_list = [];
            notification_list = mobile_list.filter((obj) => {
                return obj.notification;
            });
        } else {
            notification_list = mobile_list.filter((obj) => {
                return obj.notification;
            });
            sms_list = mobile_list.filter((obj) => {
                return !obj.notification;
            });
        }

        let notif_mobile_string = '';
        let sms_mobile_string = '';
        notification_list.forEach((item, index) => {
            notif_mobile_string += item.mobileNumber + ', ';
        });
        // notif_mobile_string = notif_mobile_string.slice(0, -2);
        sms_list.forEach((item, index) => {
            sms_mobile_string += item.mobileNumber + ', ';
        });
        sms_mobile_string = sms_mobile_string.slice(0, -2);
        notif_mobile_string = notif_mobile_string.slice(0, -2);

        if (sms_list.length > 0) {
            if (!confirm('Please confirm that you are sending ' + this.vm.getEstimatedSMSCount() + ' SMS.')) {
                return;
            }
        }

        let sms_data = {};
        const sms_converted_data = sms_list.map((item) => {
            return {
                mobileNumber: item.mobileNumber.toString(),
                isAdvanceSms: this.vm.getMessageFromTemplate(message, item),
            };
        });

        if (sms_list.length != 0) {
            sms_data = {
                contentType: this.vm.hasUnicode(this.vm.extraDefaulterMessage) ? 'unicode' : 'english',
                data: sms_converted_data,
                content: sms_converted_data[0]['isAdvanceSms'],
                parentMessageType: 2,
                count: this.vm.getEstimatedSMSCount(),
                notificationCount: notification_list.length,
                notificationMobileNumberList: notif_mobile_string,
                mobileNumberList: sms_mobile_string,
                parentSchool: this.vm.user.activeSchool.dbId,
            };
        } else {
            sms_data = {
                contentType: this.vm.hasUnicode(this.vm.extraDefaulterMessage) ? 'unicode' : 'english',
                data: sms_converted_data,
                content: this.vm.getMessageFromTemplate(message, notification_list[0]),
                parentMessageType: 2,
                count: this.vm.getEstimatedSMSCount(),
                notificationCount: notification_list.length,
                notificationMobileNumberList: notif_mobile_string,
                mobileNumberList: sms_mobile_string,
                parentSchool: this.vm.user.activeSchool.dbId,
            };
        }

        const notification_data = notification_list.map((item) => {
            return {
                parentMessageType: 2,
                content: this.vm.getMessageFromTemplate(message, item),
                parentUser: this.vm.notif_usernames.find((user) => {
                    return user.username == item.mobileNumber.toString();
                }).id,
                parentSchool: this.vm.user.activeSchool.dbId,
            };
        });

        service_list = [];
        service_list.push(this.vm.smsService.createObject(this.vm.smsService.diff_sms, sms_data));
        if (notification_data.length > 0) {
            service_list.push(this.vm.notificationService.createObjectList(this.vm.notificationService.notification, notification_data));
        }

        this.vm.isLoading = true;

        Promise.all(service_list).then(
            (value) => {
                alert('Operation Successful');

                if (
                    (this.vm.selectedSentType === this.vm.sentTypeList[0] || this.vm.selectedSentType === this.vm.sentTypeList[2]) &&
                    sms_list.length > 0
                ) {
                    if (value[0].status === 'success') {
                        this.vm.smsBalance -= value[0].data.count;
                    } else if (value[0].status === 'failure') {
                        this.vm.smsBalance = value[0].count;
                    }
                }

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
