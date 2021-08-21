import {RecordAttendanceComponent} from './record-attendance.component';
import {ATTENDANCE_STATUS_LIST} from '../../classes/constants';
import {INFORMATION_TYPE_LIST} from '../../../../classes/constants/information-type';

export class RecordAttendanceServiceAdapter {
    vm: RecordAttendanceComponent;

    informationMessageType: any;

    constructor() {
    }

    // Data

    initializeAdapter(vm: RecordAttendanceComponent): void {
        this.vm = vm;
        this.informationMessageType = INFORMATION_TYPE_LIST.indexOf('Attendance') + 1;
    }

    async initializeData() {
        this.vm.isInitialLoading = true;
        const sms_count_request_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let request_attendance_permission_list_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_settings, {
                parentSchool: this.vm.user.activeSchool.dbId,
            }), //0
            this.vm.attendanceService.getObjectList(
                this.vm.attendanceService.attendance_permission,
                request_attendance_permission_list_data
            ), //1
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //2
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //3
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt), //4
        ]).then(
            (value) => {
                this.vm.smsBalance = value[4];
                if (value[0].length > 0) {
                    this.vm.selectedSentType = value[0][0].sentUpdateType;
                    this.vm.selectedReceiver = value[0][0].receiverType;
                } else {
                    this.vm.selectedSentType = this.vm.sentTypeList[0]; // NULL
                    this.vm.selectedReceiver = this.vm.receiverList[1]; // Only Absent Students
                }
                let class_permission_list = [];
                let division_permission_list = [];
                value[1].forEach((element) => {
                    class_permission_list.push(element.parentClass);
                    division_permission_list.push(element.parentDivision);
                });
                let student_section_data = {
                    parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                    parentStudent__parentTransferCertificate: 'null__korangle',
                    parentClass__in: class_permission_list,
                    parentDivision__in: division_permission_list,
                    parentSession: this.vm.user.activeSchool.currentSessionDbId,
                };

                Promise.all([this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data)]).then(
                    async (secondValue) => {
                        let student_id_list = [];

                        secondValue[0].forEach((element) => {
                            student_id_list.push(element.parentStudent);
                        });

                        let student_tc_data = {
                            id__in: student_id_list,
                            status: 'Generated',
                            status__or: 'Issued'
                        };
                        console.log(student_id_list);
                        const tc_generated_student_list = await this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, student_tc_data);
                        console.log(tc_generated_student_list);
                        student_id_list = student_id_list.filter(id => {
                            return tc_generated_student_list.find(tc => tc.parentStudent == id) == undefined;
                        });
                        console.log(student_id_list);

                        let student_data = {
                            id__in: student_id_list,
                            fields__korangle: 'id,name,mobileNumber,scholarNumber,parentTransferCertificate',
                        };

                        Promise.all([this.vm.studentService.getObjectList(this.vm.studentService.student, student_data)]).then(
                            (thirdValue) => {
                                this.initializeClassSectionStudentList(value[2], value[3], secondValue[0], thirdValue[0], value[1]);
                                this.vm.isInitialLoading = false;
                            }
                        );
                    }
                );
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    initializeClassSectionStudentList(
        classList: any,
        divisionList: any,
        studentList: any,
        studentDetailsList: any,
        attendancePermissionList: any
    ): any {
        this.vm.classSectionStudentList = [];
        studentList.forEach((student) => {
            if (this.vm.classSectionInPermissionList(student.parentClass, student.parentDivision, attendancePermissionList)) {
                let classIndex = -1;
                let tempIndex = 0;
                this.vm.classSectionStudentList.forEach((classs) => {
                    if (classs.dbId == student.parentClass) {
                        classIndex = tempIndex;
                        return;
                    }
                    tempIndex = tempIndex + 1;
                });
                if (classIndex === -1) {
                    let classs = classList.find((classs) => classs.id === student.parentClass);
                    let tempClass = {
                        name: classs.name,
                        dbId: classs.id,
                        sectionList: [],
                    };
                    this.vm.classSectionStudentList.push(tempClass);
                    let tempIndex = 0;
                    this.vm.classSectionStudentList.forEach((classs) => {
                        if (classs.dbId == student.parentClass) {
                            classIndex = tempIndex;
                            return;
                        }
                        tempIndex = tempIndex + 1;
                    });
                }
                let divisionIndex = -1;
                tempIndex = 0;
                this.vm.classSectionStudentList[classIndex].sectionList.forEach((division) => {
                    if (division.dbId == student.parentDivision) {
                        divisionIndex = tempIndex;
                        return;
                    }
                    tempIndex = tempIndex + 1;
                });

                if (divisionIndex === -1) {
                    let division = divisionList.find((division) => division.id === student.parentDivision);
                    let tempDivision = {
                        name: division.name,
                        dbId: division.id,
                        studentList: [],
                    };
                    this.vm.classSectionStudentList[classIndex].sectionList.push(tempDivision);
                    tempIndex = 0;
                    this.vm.classSectionStudentList[classIndex].sectionList.forEach((division) => {
                        if (division.dbId == student.parentDivision) {
                            divisionIndex = tempIndex;
                            return;
                        }
                        tempIndex = tempIndex + 1;
                    });
                }
                let studentDetails = studentDetailsList.find((studentDetails) => studentDetails.id == student.parentStudent);
                let tempData = {
                    name: studentDetails.name,
                    dbId: studentDetails.id,
                    scholarNumber: studentDetails.scholarNumber,
                    mobileNumber: studentDetails.mobileNumber,
                };
                this.vm.classSectionStudentList[classIndex].sectionList[divisionIndex].studentList.push(tempData);
            }
        });
        this.vm.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.studentList.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
            });
            classs.sectionList.sort((a, b) => (a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0));
        });
        this.vm.classSectionStudentList.sort((a, b) => (a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0));
        if (this.vm.classSectionStudentList.length > 0) {
            this.vm.selectedClass = this.vm.classSectionStudentList[0];
            this.vm.changeSelectedSectionToFirst();
        }
    }

    getStudentsAttendanceStatusList(): void {
        this.vm.isLoading = true;
        this.vm.showStudentList = true;
        this.vm.currentAttendanceList = [];

        let data = {
            parentStudent__in: this.getStudentIdList(),
            dateOfAttendance__gte: this.vm.startDate,
            dateOfAttendance__lte: this.vm.endDate,
        };

        this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, data).then(
            (attendanceList) => {
                this.vm.isLoading = false;
                attendanceList.forEach((element) => {
                    this.vm.currentAttendanceList.push(element);
                });
                this.populateStudentAttendanceList(attendanceList);
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateStudentAttendanceList(attendanceList: any) {
        this.vm.studentAttendanceStatusList = [];
        this.vm.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                if (this.vm.selectedSection.dbId === section.dbId && classs.dbId === this.vm.selectedClass.dbId) {
                    section.studentList.forEach((student) => {
                        let tempItem = {
                            dbId: student.dbId,
                            name: student.name,
                            scholarNumber: student.scholarNumber,
                            mobileNumber: student.mobileNumber,
                            attendanceStatusList: [],
                        };
                        let dateList = this.vm.getDateList();
                        dateList.forEach((date) => {
                            tempItem.attendanceStatusList.push(this.vm.getStudentAttendanceStatusObject(student, date, attendanceList));
                        });
                        this.vm.studentAttendanceStatusList.push(tempItem);
                    });
                }
            });
        });
        this.fetchGCMDevices(this.vm.studentAttendanceStatusList);
    }

    updateStudentAttendanceList(): void {
        let data = this.vm.prepareStudentAttendanceStatusListData();
        if (data.length === 0) {
            return;
        }
        const promises = [];
        let toCreateAttendance = [];
        let toUpdateAttendance = [];
        data.forEach((attendance) => {
            let tempData = {
                dbId: attendance.parentStudent,
            };
            let previousAttendanceIndex = this.vm.getPreviousAttendanceIndex(tempData, new Date(attendance.dateOfAttendance));
            if (this.vm.currentAttendanceList[previousAttendanceIndex].id == null) {
                toCreateAttendance.push(attendance);
            } else {
                let tempData = {
                    id: this.vm.currentAttendanceList[previousAttendanceIndex].id,
                    dateOfAttendance: attendance.dateOfAttendance,
                    status: attendance.status,
                    parentStudent: attendance.parentStudent,
                };
                toUpdateAttendance.push(tempData);
            }
        });
        promises.push(this.vm.attendanceService.createObjectList(this.vm.attendanceService.student_attendance, toCreateAttendance));
        promises.push(this.vm.attendanceService.updateObjectList(this.vm.attendanceService.student_attendance, toUpdateAttendance));
        this.vm.isLoading = true;
        Promise.all(promises).then(
            (response) => {
                response[0].forEach((element) => {
                    let previousIndex = this.vm.currentAttendanceList.find(
                        (attendance) =>
                            attendance.parentStudent == element.parentStudent && attendance.dateOfAttendance == element.dateOfAttendance
                    );
                    previousIndex.id = element.id;
                });
                this.notifyParents();
                alert('Student Attendance recorded successfully');
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    notifyParents(): void {
        this.vm.studentList = [];
        this.vm.studentAttendanceStatusList.forEach((student) => {
            student.attendanceStatusList.forEach((attendanceStatus) => {
                let previousAttendanceIndex = this.vm.getPreviousAttendanceIndex(student, attendanceStatus.date);
                if (this.vm.currentAttendanceList[previousAttendanceIndex].status !== attendanceStatus.status) {
                    if (attendanceStatus.status !== null && this.checkMobileNumber(student.mobileNumber) == true) {
                        if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                            let tempData = {
                                name: student.name,
                                dateOfAttendance: this.vm.formatDate(attendanceStatus.date.toString(), ''),
                                attendanceStatus: attendanceStatus.status,
                                mobileNumber: student.mobileNumber,
                                notification: student.notification,
                                messageType: 1,
                            };
                            if (this.vm.currentAttendanceList[previousAttendanceIndex].status !== null) {
                                tempData.messageType = 2;
                            }
                            this.vm.studentList.push(tempData);
                        }
                        if (this.vm.selectedReceiver == this.vm.receiverList[0] && attendanceStatus.status === ATTENDANCE_STATUS_LIST[0]) {
                            let tempData = {
                                name: student.name,
                                dateOfAttendance: this.vm.formatDate(attendanceStatus.date.toString(), ''),
                                attendanceStatus: attendanceStatus.status,
                                mobileNumber: student.mobileNumber,
                                notification: student.notification,
                                messageType: 1,
                            };
                            if (this.vm.currentAttendanceList[previousAttendanceIndex].status !== null) {
                                tempData.messageType = 2;
                            }
                            this.vm.studentList.push(tempData);
                        }
                    }
                    this.vm.currentAttendanceList[previousAttendanceIndex].status = attendanceStatus.status;
                }
            });
        });
        let currentDate = new Date();
        if (
            this.vm.studentList.length > 0 &&
            this.vm.selectedSentType != this.vm.sentTypeList[0] &&
            this.vm.by == 'date' &&
            this.vm.startDate == this.vm.formatDate(currentDate, '')
        ) {
            this.sendSMSNotification(this.vm.studentList);
        }
    }

    fetchGCMDevices: any = (studentList: any) => {
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

            this.vm.isLoading = false;
        });
    }

    sendSMSNotification: any = (mobile_list: any) => {
        if (mobile_list.length == 0) {
            return;
        }
        let service_list = [];
        let notification_list = [];
        let sms_list = [];
        if (this.vm.selectedSentType == this.vm.sentTypeList[1]) {
            sms_list = mobile_list;
            notification_list = [];
        } else if (this.vm.selectedSentType == this.vm.sentTypeList[2]) {
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
        if (sms_list.length == 0 && notification_list.length == 0) {
            return;
        }
        let notif_mobile_string = '';
        let sms_mobile_string = '';
        notification_list.forEach((item, index) => {
            notif_mobile_string += item.mobileNumber + ', ';
        });
        sms_list.forEach((item, index) => {
            sms_mobile_string += item.mobileNumber + ', ';
        });
        sms_mobile_string = sms_mobile_string.slice(0, -2);
        notif_mobile_string = notif_mobile_string.slice(0, -2);
        if (sms_list.length > 0 && this.getEstimatedSMSCount() > this.vm.smsBalance) {
            alert('You are short by ' + (this.getEstimatedSMSCount() - this.vm.smsBalance) + ' SMS');
        }
        let sms_data = {};
        const sms_converted_data = sms_list.map((item) => {
            if (item.messageType === 1) {
                return {
                    mobileNumber: item.mobileNumber.toString(),
                    isAdvanceSms: this.getMessageFromTemplate(this.vm.studentUpdateMessage, item),
                };
            } else {
                return {
                    mobileNumber: item.mobileNumber.toString(),
                    isAdvanceSms: this.getMessageFromTemplate(this.vm.studentAlternateMessage, item),
                };
            }
        });
        if (sms_list.length != 0) {
            sms_data = {
                contentType: 'english',
                data: sms_converted_data,
                content: sms_converted_data[0]['isAdvanceSms'],
                parentMessageType: this.informationMessageType,
                count: this.getEstimatedSMSCount(),
                notificationCount: this.getEstimatedNotificationCount(),
                notificationMobileNumberList: notif_mobile_string,
                mobileNumberList: sms_mobile_string,
                parentSchool: this.vm.user.activeSchool.dbId,
            };
        } else {
            sms_data = {
                contentType: 'english',
                data: sms_converted_data,
                content: this.getMessageFromTemplate(this.vm.studentUpdateMessage, notification_list[0]),
                parentMessageType: this.informationMessageType,
                count: this.getEstimatedSMSCount(),
                notificationCount: this.getEstimatedNotificationCount(),
                notificationMobileNumberList: notif_mobile_string,
                mobileNumberList: sms_mobile_string,
                parentSchool: this.vm.user.activeSchool.dbId,
            };
            if (notification_list.length > 0 && notification_list[0].messageType === 2) {
                sms_data['content'] = this.getMessageFromTemplate(this.vm.studentAlternateMessage, notification_list[0]);
            }
        }

        const notification_data = notification_list.map((item) => {
            if (item.messageType === 1) {
                return {
                    parentMessageType: this.informationMessageType,
                    content: this.getMessageFromTemplate(this.vm.studentUpdateMessage, item),
                    parentUser: this.vm.notif_usernames.find((user) => {
                        return user.username == item.mobileNumber.toString();
                    }).id,
                    parentSchool: this.vm.user.activeSchool.dbId,
                };
            } else {
                return {
                    parentMessageType: this.informationMessageType,
                    content: this.getMessageFromTemplate(this.vm.studentAlternateMessage, item),
                    parentUser: this.vm.notif_usernames.find((user) => {
                        return user.username == item.mobileNumber.toString();
                    }).id,
                    parentSchool: this.vm.user.activeSchool.dbId,
                };
            }
        });
        service_list = [];
        service_list.push(this.vm.smsService.createObject(this.vm.smsService.diff_sms, sms_data));
        if (notification_data.length > 0) {
            service_list.push(this.vm.notificationService.createObjectList(this.vm.notificationService.notification, notification_data));
        }

        this.vm.isLoading = true;

        Promise.all(service_list).then(
            (value) => {
                if (
                    (this.vm.selectedSentType === this.vm.sentTypeList[1] || this.vm.selectedSentType === this.vm.sentTypeList[3]) &&
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

    getStudentIdList(): any {
        let studentIdList = [];
        this.vm.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                if (this.vm.selectedSection.dbId === section.dbId && classs.dbId === this.vm.selectedClass.dbId) {
                    section.studentList.forEach((student) => {
                        studentIdList.push(student.dbId);
                    });
                }
            });
        });
        return studentIdList;
    }

    checkMobileNumber(mobileNumber: number): boolean {
        if (mobileNumber && mobileNumber.toString().length == 10) {
            return true;
        }
        return false;
    }

    getMessageFromTemplate = (message, obj) => {
        let ret = message;
        for (let key in obj) {
            ret = ret.replace('<' + key + '>', obj[key]);
        }
        return ret;
    }

    hasUnicode(message): boolean {
        for (let i = 0; i < message.length; ++i) {
            if (message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
    }

    getEstimatedSMSCount = () => {
        let count = 0;
        if (this.vm.selectedSentType == this.vm.sentTypeList[2]) {
            return 0;
        }
        this.vm.studentList
            .filter((item) => item.mobileNumber)
            .forEach((item, i) => {
                if (this.vm.selectedSentType == this.vm.sentTypeList[1] || item.notification == false) {
                    count += this.getMessageCount(this.getMessageFromTemplate(this.vm.studentUpdateMessage, item));
                }
            });

        return count;
    }

    getMessageCount = (message) => {
        if (this.hasUnicode(message)) {
            return Math.ceil(message.length / 70);
        } else {
            return Math.ceil(message.length / 160);
        }
    }

    getEstimatedNotificationCount = () => {
        let count = 0;
        if (this.vm.selectedSentType == this.vm.sentTypeList[1]) {
            return 0;
        }

        count = this.vm.studentList.filter((item) => {
            return item.mobileNumber && item.notification;
        }).length;

        return count;
    }
}
