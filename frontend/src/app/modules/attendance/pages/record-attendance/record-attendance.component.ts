import {Component, Input, OnInit} from '@angular/core';

import { AttendanceOldService } from '../../../../services/modules/attendance/attendance-old.service';
import {StudentOldService} from '../../../../services/modules/student/student-old.service';

import { ATTENDANCE_STATUS_LIST } from '../../classes/constants';

import { ExcelService } from "../../../../excel/excel-service";
import { PrintService } from '../../../../print/print-service';
import { PRINT_STUDENT_ATTENDANCE } from '../../../../print/print-routes.constants';
import {DataStorage} from "../../../../classes/data-storage";
import { SmsService } from '../../../../services/modules/sms/sms.service';
import {NotificationService} from "../../../../services/modules/notification/notification.service";
import {UserService} from "../../../../services/modules/user/user.service";
import { RecordAttendanceServiceAdapter } from "./record-attendance.service.adapter";

@Component({
  selector: 'record-attendance',
  templateUrl: './record-attendance.component.html',
  styleUrls: ['./record-attendance.component.css'],
    providers: [
        AttendanceOldService,
        StudentOldService,
        NotificationService,
        SmsService,
        UserService,
    ],
})

export class RecordAttendanceComponent implements OnInit {

    // @Input() user;
    user: any;

    classSectionStudentList = [];

    selectedClass: any;

    selectedSection: any;

    by = 'date';

    startDate = null;
    endDate = null;

    showStudentList = false;

    studentAttendanceStatusList: any;

    isInitialLoading = false;

    isLoading = false;

    attendanceStatusList = ATTENDANCE_STATUS_LIST;

    mobileNumberList = [];
    STUDENT_LIMITER = 200;
    
    studentUpdateMessage = "Your ward, <name> is marked <attendanceStatus> on <dateOfAttendance>";

    sentTypeList = [
        'SMS',
        'NOTIFICATION',
        'NOTIF./SMS',
    ];

    studentList :any;

    selectedSentType = 'SMS';
    smsBalance = 0;

    notif_usernames = [];

    serviceAdapter: RecordAttendanceServiceAdapter

    constructor (private attendanceService: AttendanceOldService,
                 private studentService: StudentOldService,
                 private excelService: ExcelService,
                 private printServie: PrintService,
                 public notificationService: NotificationService,
                 public smsService: SmsService,
                 public userService: UserService,
                 ) { }

    changeSelectedSectionToFirst(): void {
        this.selectedSection = this.selectedClass.sectionList[0];
    }


    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new RecordAttendanceServiceAdapter();
        let request_attendance_permission_list_data = {
            parentEmployee: this.user.activeSchool.employeeId,
            sessionId: this.user.activeSchool.currentSessionDbId,
        };

        let request_student_data = {
            schoolDbId: this.user.activeSchool.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };

        this.isInitialLoading = true;

        Promise.all([
            this.attendanceService.getAttendancePermissionList(request_attendance_permission_list_data, this.user.jwt),
            this.studentService.getClassSectionStudentList(request_student_data, this.user.jwt),
            this.serviceAdapter.initializeAdapter(this)
        ]).then(value => {
            this.isInitialLoading = false;
            this.initializeClassSectionStudentList(value[0], value[1]);
        }, error => {
            this.isInitialLoading = false;
        });

    }

    initializeClassSectionStudentList(attendancePermissionList: any, classSectionStudentList: any): void {
        classSectionStudentList.forEach( classs => {
            let tempClass = {
                name: classs.name,
                dbId: classs.dbId,
                sectionList: [],
            };
            classs.sectionList.forEach( section => {
                if (this.classSectionInPermissionList(classs.dbId, section.dbId, attendancePermissionList)) {
                    let tempSection = {
                        name: section.name,
                        dbId: section.dbId,
                        studentList: [],
                    };
                    section.studentList.forEach( student => {
                        if (student.parentTransferCertificate === null) {
                            let tempStudent = {
                                name: student.name,
                                dbId: student.dbId,
                                scholarNumber: student.scholarNumber,
                                mobileNumber: student.mobileNumber
                            };
                            tempSection.studentList.push(tempStudent);
                        }
                    });
                    if (tempSection.studentList.length > 0) {
                        tempClass.sectionList.push(tempSection);
                    }
                }
            });
            if (tempClass.sectionList.length > 0) {
                this.classSectionStudentList.push(tempClass);
            }
        });
        if (this.classSectionStudentList.length > 0) {
            this.selectedClass = this.classSectionStudentList[0];
            this.changeSelectedSectionToFirst();
        }
    }

    classSectionInPermissionList(classDbId: number, sectionDbId: number, attendancePermissionList: any): boolean {
        let result = false;
        attendancePermissionList.every(item => {
            if (item.parentDivision === sectionDbId && item.parentClass === classDbId) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }


    // Server Handling - 1
    getStudentIdList(): any {
        let studentIdList = [];
        this.classSectionStudentList.forEach(classs => {
            classs.sectionList.forEach(section => {
                if (this.selectedSection.dbId === section.dbId && classs.dbId === this.selectedClass.dbId) {
                    section.studentList.forEach(student => {
                        studentIdList.push(student.dbId);
                    });
                }
            });
        });
        return studentIdList;
    }

    getStudentsAttendanceStatusList(): void {

        let data = {
            studentIdList: this.getStudentIdList(),
            startDate: this.startDate,
            endDate: this.endDate,
        };

        this.isLoading = true;
        this.showStudentList = true;

        this.attendanceService.getStudentAttendanceList(data, this.user.jwt).then(attendanceList => {
            this.isLoading = false;
            this.populateStudentAttendanceList(attendanceList);
        }, error => {
            this.isLoading = false;
        });

    }

    populateStudentAttendanceList(attendanceList: any): void {
        this.studentAttendanceStatusList = [];
        this.classSectionStudentList.forEach(classs => {
            classs.sectionList.forEach(section => {
                if (this.selectedSection.dbId === section.dbId && classs.dbId === this.selectedClass.dbId) {
                    section.studentList.forEach(student => {
                        let tempItem = {
                            dbId: student.dbId,
                            name: student.name,
                            scholarNumber: student.scholarNumber,
                            mobileNumber: student.mobileNumber,
                            attendanceStatusList: [],
                        };
                        let dateList = this.getDateList();
                        dateList.forEach(date => {
                            tempItem.attendanceStatusList.push(this.getStudentAttendanceStatusObject(student, date, attendanceList));
                        });
                        this.studentAttendanceStatusList.push(tempItem);
                    });
                }
            });
        });
    }

    getStudentAttendanceStatusObject(student: any, date: any, attendanceStatusList: any): any {
        let temp = {
            date: date,
            status: null,
        };
        attendanceStatusList.every(studentAttendanceStatus => {
            if (studentAttendanceStatus.parentStudent === student.dbId
                && (new Date(studentAttendanceStatus.dateOfAttendance)).getTime() === date.getTime()) {
                temp.status = studentAttendanceStatus.status;
                return false;
            }
            return true;
        });
        return temp;
    }


    // Server Handling - 2
    updateStudentAttendanceList(): void {

        let data = this.prepareStudentAttendanceStatusListData();

        if (data.length === 0) {
            alert('Nothing to update');
            return;
        }

        this.isLoading = true;
        this.attendanceService.recordStudentAttendance(data, this.user.jwt).then(response => {
            this.isLoading = false;
            alert(response);
        }, error => {
            this.isLoading = false;
        });
        this.notifyParents();
    }

    prepareStudentAttendanceStatusListData(): any {
        let studentAttendanceStatusListData = [];
        this.studentAttendanceStatusList.forEach(student => {
            student.attendanceStatusList.forEach(attendanceStatus => {
                if (attendanceStatus.status !== null) {
                    let tempData = {
                        parentStudent: student.dbId,
                        dateOfAttendance: this.formatDate(attendanceStatus.date.toString(), ''),
                        status: attendanceStatus.status,
                    };
                    studentAttendanceStatusListData.push(tempData);
                }
            });
        });
        return studentAttendanceStatusListData;
    }


    // For Printing
    printStudentAttendanceList(): void {
        let value = {
            studentAttendanceList: this.studentAttendanceStatusList,
            startDate: this.startDate,
            endDate: this.endDate,
            by: this.by,
        };
        this.printServie.navigateToPrintRoute(PRINT_STUDENT_ATTENDANCE, {user: this.user, value});
    }

    // For Downloading
    downloadList(): void {

        let template: any;

        template = [

            this.getHeaderValues(),

        ];

        this.studentAttendanceStatusList.forEach((student, index) => {
            template.push(this.getStudentDisplayInfo(student, index));
        });

        this.excelService.downloadFile(template, 'korangle_student_attendance.csv');
    }

    getHeaderValues(): any {
        let headerValues = [];
        headerValues.push('Serial No.');
        headerValues.push('Name');
        headerValues.push('Scholar No.');
        if (this.by === 'date') {
            headerValues.push('Attendance');
        } else {
            headerValues.push('Abs./Total');
            this.getDateList().forEach(date => {
                headerValues.push(date.getDate());
            });
        }

        return headerValues;
    }

    getStudentDisplayInfo(student: any, index: any): any {
        let studentDisplay = [];
        studentDisplay.push(index+1);
        studentDisplay.push(student.name);
        studentDisplay.push(student.scholarNumber);
        studentDisplay.push(this.getStudentRecord(student));
        student.attendanceStatusList.forEach(attendanceStatus => {
            studentDisplay.push(this.getButtonString(attendanceStatus.status));
        });

        return studentDisplay;
    }


    // Called from Html files
    declareAllPresent(): void {
        this.studentAttendanceStatusList.forEach(student => {
            student.attendanceStatusList.forEach(attendanceStatus => {
                if (attendanceStatus.status !== ATTENDANCE_STATUS_LIST[2]) {
                    attendanceStatus.status = ATTENDANCE_STATUS_LIST[0];
                }
            });
        });
    }

    changeStudentAttendanceStatus(temp: any): void {
        if(!temp.status) {
            temp.status = ATTENDANCE_STATUS_LIST[0];
            return;
        }
        let counter = 0;
        for (let i = 0; i < ATTENDANCE_STATUS_LIST.length; ++i) {
            if (ATTENDANCE_STATUS_LIST[i] === temp.status) {
                counter = i;
                break;
            }
        }
        let nextCounter = (counter+1)%ATTENDANCE_STATUS_LIST.length;
        if (nextCounter === 2) {
            nextCounter = (nextCounter+2)%ATTENDANCE_STATUS_LIST.length;
        }
        temp.status = ATTENDANCE_STATUS_LIST[nextCounter];
    }

    handleModeChange(event: any): void {
        this.by = event;
        this.startDate = null;
        this.endDate = null;
        this.showStudentList = false;
    }

    onDateSelected(event: any): void {
        this.startDate = this.formatDate(event, '');
        this.endDate = this.startDate;
        this.showStudentList = false;
    }

    onMonthSelected(event: any): void {
        setTimeout(() => {
            this.startDate = this.formatDate(event, 'firstDate');
            this.endDate = this.formatDate(event, 'lastDate');
            this.showStudentList = false;
        }, 100);
    }

    formatDate(dateStr: any, status: any): any {

        let d = new Date(dateStr);

        if (status === 'firstDate') {
            d = new Date(d.getFullYear(), d.getMonth(), 1);
        } else if (status === 'lastDate') {
            d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getDateList(): any {
        let dateList = [];

        let tempDate = new Date(this.startDate);
        let lastDate = new Date(this.endDate);

        while(tempDate <= lastDate) {
            dateList.push(new Date(tempDate));
            tempDate.setDate(tempDate.getDate() + 1);
        }

        return dateList;
    }

    getButtonClass(status: any): any {
        let classs = "btn";
        switch (status) {
            case ATTENDANCE_STATUS_LIST[2]:
                classs += " btn-warning";
                break;
            case ATTENDANCE_STATUS_LIST[1]:
                classs += " btn-danger";
                break;
            case ATTENDANCE_STATUS_LIST[0]:
                classs += " btn-success";
                break;
        }
        return classs;
    }

    getButtonString(status: any): any {
        let result = 'N';
        if (status) {
            result = status.substring(0,1);
        }
        return result;
    }

    getStatusNumber(status: any): any {
        let count = 0;
        if(status === undefined) {
            this.studentAttendanceStatusList.forEach(student => {
                student.attendanceStatusList.forEach(attendanceStatus => {
                    if (attendanceStatus.status === null) {
                        count = count + 1;
                    }
                });
            });
        } else {
            this.studentAttendanceStatusList.forEach(student => {
                student.attendanceStatusList.forEach(attendanceStatus => {
                    if (attendanceStatus.status === status) {
                        count = count + 1;
                    }
                });
            });
        }
        return count;
    }

    getStudentRecord(student: any): any {
        let absentCount = 0, totalCount = 0;
        student.attendanceStatusList.forEach(attendanceStatus => {
            if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[0]) {
                totalCount += 1;
            } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                absentCount += 1;
                totalCount += 1;
            }
        });
        return absentCount + '/' + totalCount;
    }

    getMatTooltip(student: any, attendance: any): any {
        let dateStr = this.formatDate(attendance.date.toString(), '');
        dateStr = dateStr.substr(dateStr.length-2,2);
        return student.name
            + ', '
            + dateStr;
    }

    
    notifyParents(): void{
            let message = this.studentUpdateMessage;
            
            let mobile_numbers = [];
            this.studentAttendanceStatusList.forEach(student => {
                student.attendanceStatusList.forEach(attendanceStatus => {
                    if (attendanceStatus.status !== null) {
                        let tempData = {
                            id: student.dbID,
                            name: student.name,
                            dateOfAttendance: this.formatDate(attendanceStatus.date.toString(), ''),
                            attendanceStatus: attendanceStatus.status,
                            mobileNumber: student.mobileNumber,
                            notification: student.notification
                        };
                        mobile_numbers.push(tempData);
                    }
                });
            });
            // console.log(mobile_numbers);
            this.studentList = mobile_numbers;
            // console.log(this.studentList);
            this.serviceAdapter.fetchGCMDevices(this.studentList);
        
    }

    fetchGCMDevices: any = (studentList: any) => {
        // console.log(studentList);
        const service_list = [];
        const iterationCount = Math.ceil(studentList.length / this.STUDENT_LIMITER);
        let loopVariable = 0;

        while (loopVariable < iterationCount) {
            const mobile_list = studentList.filter(item => item.mobileNumber).map(obj => obj.mobileNumber.toString());
            const gcm_data = {
                'user__username__in': mobile_list.slice(
                    this.STUDENT_LIMITER * loopVariable, this.STUDENT_LIMITER * (loopVariable + 1)
                ),
                'active': 'true__boolean',
            }
            // console.log(gcm_data);
            const user_data = {
                'fields__korangle': 'username,id',
                'username__in': mobile_list.slice(this.STUDENT_LIMITER * loopVariable, this.STUDENT_LIMITER * (loopVariable + 1)),
            };
            // console.log(user_data);
            service_list.push(this.notificationService.getObjectList(this.notificationService.gcm_device, gcm_data));
            service_list.push(this.userService.getObjectList(this.userService.user, user_data));
            // console.log(service_list);
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

            const notif_usernames = temp_user_list.filter(user => {
                return temp_gcm_list.find(item => {
                    return item.user == user.id;
                }) != undefined;
            })
            // Storing because they're used later
            this.notif_usernames = notif_usernames;

            let notification_list;

            notification_list = studentList.filter(obj => {
                return notif_usernames.find(user => {
                    return user.username == obj.mobileNumber;
                }) != undefined;
            });
            studentList.forEach((item, i) => {
                item.notification = false;
            })
            notification_list.forEach((item, i) => {
                item.notification = true;
            })


            this.isLoading = false;
        })
        // console.log(studentList);
        
        this.sendSMSNotification(this.studentList, this.studentUpdateMessage);
    }


    sendSMSNotification: any = (mobile_list: any, message: string) => {
        let service_list = [];
        let notification_list = [];
        let sms_list = [];
        if (this.selectedSentType == this.sentTypeList[0]) {
            sms_list = mobile_list;
            notification_list = [];
        } else if (this.selectedSentType == this.sentTypeList[1]) {
            sms_list = [];
            notification_list = mobile_list.filter(obj => {
                return obj.notification;
            });
        } else {
            notification_list = mobile_list.filter(obj => {
                return obj.notification;
            });
            sms_list = mobile_list.filter(obj => {
                return !obj.notification;
            })
        }

        let notif_mobile_string = '';
        let sms_mobile_string = '';
        notification_list.forEach((item, index) => {
            notif_mobile_string += item.mobileNumber + ', ';
        });
        // notif_mobile_string = notif_mobile_string.slice(0, -2);
        sms_list.forEach((item, index) => {
            sms_mobile_string += item.mobileNumber + ', ';
        })
        sms_mobile_string = sms_mobile_string.slice(0, -2);
        notif_mobile_string = notif_mobile_string.slice(0, -2);
        
        if (sms_list.length > 0) {
            if (!confirm('Please confirm that you are sending ' + (this.getEstimatedSMSCount()) + ' SMS.')) {
                return;
            }
        }
        let sms_data = {};
        const sms_converted_data = sms_list.map(item => {
            return {
                'mobileNumber': item.mobileNumber.toString(),
                'isAdvanceSms': this.getMessageFromTemplate(message, item)
            }
        });

        if (sms_list.length != 0) {

            sms_data = {
                'contentType': ('english'),
                'data': sms_converted_data,
                'content': sms_converted_data[0]['isAdvanceSms'],
                'parentMessageType': 2,
                'count': this.getEstimatedSMSCount(),
                'notificationCount': notification_list.length,
                'notificationMobileNumberList': notif_mobile_string,
                'mobileNumberList': sms_mobile_string,
                'parentSchool': this.user.activeSchool.dbId,
            };

        } else {

            sms_data = {
                'contentType': ('english'),
                'data': sms_converted_data,
                'content': this.getMessageFromTemplate(message, notification_list[0]),
                'parentMessageType': 2,
                'count': this.getEstimatedSMSCount(),
                'notificationCount': notification_list.length,
                'notificationMobileNumberList': notif_mobile_string,
                'mobileNumberList': sms_mobile_string,
                'parentSchool': this.user.activeSchool.dbId,
            };

        }

        const notification_data = notification_list.map(item => {
            return {
                'parentMessageType': 2,
                'content': this.getMessageFromTemplate(message, item),
                'parentUser': this.notif_usernames.find(user => { return user.username == item.mobileNumber.toString(); }).id,
                'parentSchool': this.user.activeSchool.dbId,
            };
        });
        // console.log(sms_data);
        service_list = [];
        service_list.push(this.smsService.createObject(this.smsService.diff_sms, sms_data));
        if (notification_data.length > 0 ) {
            service_list.push(this.notificationService.createObjectList(this.notificationService.notification, notification_data));
        }

        this.isLoading = true;

        Promise.all(service_list).then(value => {

            alert('Operation Successful');

            if ((this.selectedSentType === this.sentTypeList[0] ||
                this.selectedSentType === this.sentTypeList[2]) &&
                (sms_list.length > 0)) {
                if (value[0].status === 'success') {
                    this.smsBalance -= value[0].data.count;
                } else if (value[0].status === 'failure') {
                    this.smsBalance = value[0].count;
                }
            }

            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        })
    }

    getMessageFromTemplate = (message, obj) => {
        let ret = message;
        for(let key in obj){
            ret = ret.replace("<"+key+">", obj[key]);
        }
        return ret;
    }

    hasUnicode(message): boolean {
        for (let i=0; i<message.length; ++i) {
            if (message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
    }

    getEstimatedSMSCount = () => {
        let count = 0;
        if(this.selectedSentType==this.sentTypeList[1])return 0;
            this.studentList.filter(item => item.mobileNumber).forEach((item, i) => {
                if(this.selectedSentType==this.sentTypeList[0] || item.notification==false){
                    count += this.getMessageCount(this.getMessageFromTemplate(this.studentUpdateMessage, item));
                }
            })
        
        return count;
    }

    getMessageCount = (message) => {
        if (this.hasUnicode(message)){
            return Math.ceil(message.length/70);
        }else{
            return Math.ceil( message.length/160);
        }
    }

    getEstimatedNotificationCount = () => {
        let count = 0;
        if(this.selectedSentType==this.sentTypeList[0])return 0;
    
        count = this.studentList.filter((item) => {
            return item.mobileNumber && item.notification;
        }).length;
    
        return count;
    }   

    

}
