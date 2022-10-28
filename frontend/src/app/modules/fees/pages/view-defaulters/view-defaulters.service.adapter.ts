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
            this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, {SMSEventId: this.vm.NOTIFY_DEFAULTERS_EVENT_DBID}), //1
            this.vm.smsService.getObject(this.vm.smsService.sms_event, {id: this.vm.NOTIFY_DEFAULTERS_EVENT_DBID}), //2
            this.vm.informationService.getObjectList(this.vm.informationService.send_update_type, {}),      // 3
            this.vm.genericService.getObject({fees_third_app: 'ViewDefaulterPermissions'}, {        // 4
                filter: {
                    parentEmployeePermission__parentEmployee: this.vm.user.activeSchool.employeeId
                }
            })
        ]);

        this.vm.backendData.smsIdSchoolList = firstValue[0];
        this.vm.backendData.eventSettingsList = firstValue[1];
        this.vm.backendData.defaultersSMSEvent = firstValue[2];
        this.vm.backendData.sendUpdateTypeList = firstValue[3].filter(x => x.name != "NULL");
        this.vm.userInput.selectedSendUpdateType = this.vm.backendData.sendUpdateTypeList[0];
        this.vm.userNotifyDefaulterPermissionList = firstValue[4];

        this.vm.userNotifyDefaulterPermissionList = await this.vm.genericService.getObject({
            fees_third_app: 'ViewDefaulterPermissions'
         }, {
            filter: {
                parentEmployeePermission__parentEmployee: this.vm.user.activeSchool.employeeId
            }
        });

        if(!this.vm.userNotifyDefaulterPermissionList){
            let parentEmployeePermission = await this.vm.genericService.getObject({ employee_app: 'EmployeePermission' }, {
                filter: {
                    parentEmployee: this.vm.user.activeSchool.employeeId,
                    parentTask: 66
                }
            });

            if(!parentEmployeePermission) {
                parentEmployeePermission = await this.vm.genericService.createObject({employee_app: 'EmployeePermission'}, {
                    parentTask: 66,
                    parentEmployee: this.vm.user.activeSchool.employeeId,
                });
            }


            let result = await this.vm.genericService.createObject({
                fees_third_app: 'ViewDefaulterPermissions'
            }, {
                parentEmployeePermission: parentEmployeePermission.id
            });
            this.vm.userNotifyDefaulterPermissionList = result;
        }


        this.vm.backendData.smsIdList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id, {
            id__in: this.vm.backendData.smsIdSchoolList.map(a => a.parentSMSId),
            smsIdStatus: 'ACTIVATED'
        });
        this.vm.backendData.templateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_template, {
            id__in: this.vm.backendData.eventSettingsList.map(a => a.parentSMSTemplate),
            'korangle__order': '-id',
        });

        this.populateTemplateList();

        const value = await Promise.all([
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 0
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}), //1
            this.vm.genericService.getObjectList({attendance_app: 'AttendancePermission'}, {
                filter: {
                    parentEmployee: this.vm.user.activeSchool.employeeId,
                    parentSession: this.vm.user.activeSchool.currentSessionDbId,
                }
            }) // 2
        ]);
        this.vm.attendancePermissionList = value[2];

        if (!this.vm.hasAdminPermission() && this.vm.attendancePermissionList.length === 0) {
            alert("You do not have permission to view defaulters. Please contact your administrator.");
            this.vm.isLoading = false;
            return;
        }

        const feeTypeList = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_section_list = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentDivision__in: Array.from(
                new Set(
                    this.vm.attendancePermissionList.map((item) => {
                        return item.parentDivision;
                    })
                )
            ).join(),
            parentClass__in: Array.from(
                new Set(
                    this.vm.attendancePermissionList.map((item) => {
                        return item.parentClass;
                    })
                )
            ).join(),
            parentStudent__parentTransferCertificate: 'null__korangle',
        };

        if(this.vm.hasAdminPermission()){
            student_section_list['parentClass__in'] = value[0].map(classs => classs.id).join();
            student_section_list['parentDivision__in'] = value[1].map(div => div.id).join();
        }

        Promise.all([
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),     // 0
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, {        // 1
                parentSchool: this.vm.user.activeSchool.dbId,
                parameterType: 'FILTER',
            }),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, {      // 2
                parentStudentParameter__parentSchool: this.vm.user.activeSchool.dbId,
                parentStudentParameter__parameterType: 'FILTER',
            }),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, feeTypeList),     // 3    
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

                service_list.push(this.vm.classService.getObjectList(this.vm.classService.classs, {})); // 0
                service_list.push(this.vm.classService.getObjectList(this.vm.classService.division, {})); // 1
                service_list.push(this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt)); // 2

                const student_list = {
                    id__in: tempStudentIdList,
                    fields__korangle: 'id,name,fathersName,mobileNumber,secondMobileNumber,address,scholarNumber',
                };

                const student_fee_list = {
                    parentSession__or: this.vm.user.activeSchool.currentSessionDbId,
                    cleared: 'false__boolean',
                    parentStudent__in: tempStudentIdList,
                };

                const sub_fee_receipt_list = {
                    parentStudentFee__parentSession__or: this.vm.user.activeSchool.currentSessionDbId,
                    parentStudentFee__cleared: 'false__boolean',
                    parentStudentFee__parentStudent__in: tempStudentIdList,
                    parentFeeReceipt__cancelled: 'false__boolean',
                };

                const sub_discount_list = {
                    parentStudentFee__parentSession__or: this.vm.user.activeSchool.currentSessionDbId,
                    parentStudentFee__cleared: 'false__boolean',
                    parentStudentFee__parentStudent__in: tempStudentIdList,
                    parentDiscount__cancelled: 'false__boolean',
                };
                service_list.push(this.vm.studentService.getObjectList(this.vm.studentService.student, student_list)); // 3
                service_list.push(this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_list)); // 4
                service_list.push(this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list)); // 5
                service_list.push(this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list)); // 6

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

                        this.vm.studentList = this.vm.studentList.concat(value[3]);
                        this.vm.studentFeeList = this.vm.studentFeeList.concat(value[4]);
                        this.vm.subFeeReceiptList = this.vm.subFeeReceiptList.concat(value[5]);
                        this.vm.subDiscountList = this.vm.subDiscountList.concat(value[6]);

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
            !confirm('Please confirm that you are ' + (this.vm.userInput.scheduleSMS ? 'Scheduling ' : 'Sending ') +
                this.vm.getEstimatedSMSCount() + ' SMS.')) {
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
        if (this.vm.userInput.scheduleSMS && this.vm.userInput.scheduledDate && this.vm.userInput.scheduledTime) {
            scheduledDataTime = moment(this.vm.userInput.scheduledDate + ' ' + this.vm.userInput.scheduledTime).format('YYYY-MM-DD HH:mm');
        }
        this.vm.dataForMapping['studentList'] = studentData;
        try {
           this.vm.smsBalance = await this.vm.messageService.sendEventSMSNotification(
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
        alert(this.vm.userInput.selectedSendUpdateType.name + (this.vm.userInput.scheduleSMS ? ' Scheduled' : ' Sent') + ' Successfully');
        this.vm.isLoading = false;
    }
}
