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

        // Starts:- Getting initial data
        const firstValue = await Promise.all([this.vm.smsService.getObjectList(this.vm.smsService.sms_id_school,
            {parentSchool: this.vm.user.activeSchool.dbId}), //0
            this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, {SMSEventId: this.vm.NOTIFY_DEFAULTERS_EVENT_DBID}), //1
            this.vm.smsService.getObject(this.vm.smsService.sms_event, {id: this.vm.NOTIFY_DEFAULTERS_EVENT_DBID}), //2
            this.vm.informationService.getObjectList(this.vm.informationService.send_update_type, {}),      // 3
            this.vm.genericService.getObject({fees_third_app: 'ViewDefaulterPermissions'}, {        // 4
                filter: {
                    parentEmployeePermission__parentEmployee: this.vm.user.activeSchool.employeeId
                }
            }),
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 5
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}),  // 6
            this.vm.genericService.getObjectList({school_app: 'Session'}, {})   // 7
        ]);

        this.vm.backendData.smsIdSchoolList = firstValue[0];
        this.vm.backendData.eventSettingsList = firstValue[1];
        this.vm.backendData.defaultersSMSEvent = firstValue[2];
        this.vm.backendData.sendUpdateTypeList = firstValue[3].filter(x => x.name != "NULL");
        this.vm.userInput.selectedSendUpdateType = this.vm.backendData.sendUpdateTypeList[0];
        this.vm.userNotifyDefaulterPermissionList = firstValue[4];
        this.vm.classList = firstValue[5];
        this.vm.sectionList = firstValue[6];
        this.vm.sessionList = firstValue[7];
        const todaysDate = new Date();
        this.vm.currentSession = this.vm.sessionList.find((session) => {
            return (
                new Date(session.startDate) <= todaysDate &&
                new Date(new Date(session.endDate).getTime() + 24 * 60 * 60 * 1000) > todaysDate
            );
        });
        // Ends:- Getting initial data

        // Starts :- Populate In Page permission in backend if it doesn't exist and get default permission in result
        if(!this.vm.userNotifyDefaulterPermissionList){
            let parentEmployeePermission = await this.vm.genericService.getObject({ employee_app: 'EmployeePermission' }, {
                filter: {
                    parentEmployee: this.vm.user.activeSchool.employeeId,
                    parentTask: 66
                }
            });

            let result = await this.vm.genericService.createObject({
                fees_third_app: 'ViewDefaulterPermissions'
            }, {
                parentEmployeePermission: parentEmployeePermission.id
            });
            this.vm.userNotifyDefaulterPermissionList = result;
        }
        // Ends :- Populate In Page permission in backend if it doesn't exist and get default permission in result

        // Starts :- Handling sms/notification part
        this.vm.backendData.smsIdList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id, {
            id__in: this.vm.backendData.smsIdSchoolList.map(a => a.parentSMSId),
            smsIdStatus: 'ACTIVATED'
        });
        this.vm.backendData.templateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_template, {
            id__in: this.vm.backendData.eventSettingsList.map(a => a.parentSMSTemplate),
            'korangle__order': '-id',
        });

        this.populateTemplateList();
        // Ends :- Handling sms/notification part

        // Starts :- Should return from here if user doesn't have permission of a single class section
        if (!this.vm.hasAdminPermission()) {

            this.vm.attendancePermissionList = this.vm.genericService.getObjectList({attendance_app: 'AttendancePermission'}, {
                filter: {
                    parentEmployee: this.vm.user.activeSchool.employeeId,
                    parentSession: this.vm.user.activeSchool.currentSessionDbId,
                }
            });

            if (this.vm.attendancePermissionList.length === 0) {
                alert("You do not have permission to view the list of any class. Either get admin permission from Employee -> Assign Task page for all classes or get permission of specific classes from Class -> Assign Class page.");
                this.vm.isLoading = false;
                return;
            }

        }
        // Ends :- Should return from here if user doesn't have permission of a single class section

        // Starts :- Populating Student Section List Filter
        const student_section_list_filter = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentTransferCertificate: 'null__korangle'
        };

        if(this.vm.attendancePermissionList.length > 0) { // This will happen only when admin permission is not present otherwise we wouldn't have fetched attendance permission list from backend.
            /*student_section_list_filter['parentClass__in'] = Array.from(
                new Set(
                    this.vm.attendancePermissionList.map((item) => {
                        return item.parentClass;
                    })
                )
            ).join();
            student_section_list_filter['parentDivision__in'] = Array.from(
                new Set(
                    this.vm.attendancePermissionList.map((item) => {
                        return item.parentDivision;
                    })
                )
            ).join();*/
            student_section_list_filter['__or__classSection'] = [];
            this.vm.attendancePermissionList.array.forEach(attendancePermission => {
                student_section_list_filter['__or__classSection'].push({
                    parentClass: attendancePermission.parentClass,
                    parentDivision: attendancePermission.parentDivision
                });
            });
        }
        // Ends :- Populating Student Section List Filter

        const feeTypeList = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        // Starts :- Populating Fee Type List, Student Custom Filter Parameters, Student Values of Student Custom Filter Parameters.
        let val = await Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, {        // 0
                parentSchool: this.vm.user.activeSchool.dbId,
                parameterType: 'FILTER',
            }),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, {      // 1
                parentStudentParameter__parentSchool: this.vm.user.activeSchool.dbId,
                parentStudentParameter__parameterType: 'FILTER',
            }),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, feeTypeList),     // 2
        ]);

        this.vm.studentParameterList = val[0].map((x) => ({
            ...x,
            filterValues: JSON.parse(x.filterValues).map((x) => ({ name: x, show: false })),
            showNone: false,
            filterFilterValues: '',
        }));
        this.vm.studentParameterValueList = val[1];
        this.vm.feeTypeList = val[2];
        // Ends :- Populating Fee Type List, Student Custom Filter Parameters, Student Values of Student Custom Filter Parameters.

        // Starts :- Populating Student List and Student Fees Data
        this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list_filter).then(
            (valueList) => {
                this.vm.studentSectionList = valueList;

                this.vm.dataForMapping['studentSectionList'] = valueList;

                const tempStudentIdList = valueList.map((a) => a.parentStudent);

                const service_list = [];

                const sms_count_request_data = {
                    parentSchool: this.vm.user.activeSchool.dbId,
                };

                service_list.push(this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt)); // 0

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
                service_list.push(this.vm.studentService.getObjectList(this.vm.studentService.student, student_list)); // 1
                service_list.push(this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_list)); // 2
                service_list.push(this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list)); // 3
                service_list.push(this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list)); // 4

                Promise.all(service_list).then(
                    (value) => {
                        this.vm.smsBalance = value[0].count;

                        this.vm.dataForMapping['classList'] = this.vm.classList;
                        this.vm.dataForMapping['divisionList'] = this.vm.sectionList;
                        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

                        this.vm.studentList = [];
                        this.vm.studentFeeList = [];
                        this.vm.subFeeReceiptList = [];
                        this.vm.subDiscountList = [];

                        this.vm.studentList = this.vm.studentList.concat(value[1]);
                        this.vm.studentFeeList = this.vm.studentFeeList.concat(value[2]);
                        this.vm.subFeeReceiptList = this.vm.subFeeReceiptList.concat(value[3]);
                        this.vm.subDiscountList = this.vm.subDiscountList.concat(value[4]);

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
        // Ends :- Populating Student List and Student Fees Data
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
