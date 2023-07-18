import { Component, Input, OnInit } from '@angular/core';

import { StudentService } from '../../../../services/modules/student/student.service';

import { ATTENDANCE_STATUS_LIST, RECEIVER_LIST } from '../../classes/constants';

import { ExcelService } from '../../../../excel/excel-service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_STUDENT_ATTENDANCE } from '../../../../print/print-routes.constants';
import { DataStorage } from '../../../../classes/data-storage';
import { SmsService } from '../../../../services/modules/sms/sms.service';
import { NotificationService } from '../../../../services/modules/notification/notification.service';
import { UserService } from '../../../../services/modules/user/user.service';
import { RecordAttendanceServiceAdapter } from './record-attendance.service.adapter';
import { AttendanceService } from '../../../../services/modules/attendance/attendance.service';
import { SmsOldService } from '../../../../services/modules/sms/sms-old.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import {MessageService} from '@services/message-service';
import {valueType} from '@modules/common/in-page-permission';
import {ADMIN_PERMSSION, USER_PERMISSION_KEY} from './record-attendance.permissions';
import {EmployeeService} from '@services/modules/employee/employee.service';
import {TCService} from '@services/modules/tc/tc.service';
import { isMobile } from '../../../../classes/common';

@Component({
    selector: 'record-attendance',
    templateUrl: './record-attendance.component.html',
    styleUrls: ['./record-attendance.component.css'],
    providers: [NotificationService, SmsService, UserService, AttendanceService, StudentService, SmsOldService, ClassService, EmployeeService, TCService],
})
export class RecordAttendanceComponent implements OnInit {
    // @Input() user;
    user: any;

    classSectionStudentList = [];

    selectedClass: any;

    selectedSection: any;

    dataForMapping =  {} as any;

    by = 'date';

    startDate = null;
    endDate = null;

    showStudentList = false;

    studentAttendanceStatusList = [];

    isInitialLoading = false;

    isLoading = false;

    attendanceStatusList = ATTENDANCE_STATUS_LIST;

    // ---------- Start : variables for sorting studentAttendanceStatusList ---------
    SORT_BY_ROLL_INC: string = 'sortAscendingByRoll';
    SORT_BY_ROLL_DEC: string = 'sortDescendingByRoll';
    SORT_BY_NAME_INC: string = 'sortAscendingByName';
    SORT_BY_NAME_DEC: string = 'sortDescendingByName';

    sortingOptions = [{name: this.SORT_BY_ROLL_INC, value: 'Roll No. ( Increasing )'},
        {name: this.SORT_BY_ROLL_DEC, value: 'Roll No. ( Decreasing )'},
        {name: this.SORT_BY_NAME_INC, value: 'Name ( A-Z )'},
        {name: this.SORT_BY_NAME_DEC, value: 'Name ( Z-A )'}];

    selectedSort = this.sortingOptions[0];
    // ---------- Ends : variables for sorting studentAttendanceStatusList ---------


    mobileNumberList = [];

    studentList: any;

    smsBalance = 0;

    receiverList = RECEIVER_LIST;

    ATTENDANCE_CREATION_EVENT_DBID = 5;
    ATTENDANCE_UPDATION_EVENT_DBID = 6;

    backendData = {
        eventSettingsList: [],
        attendanceSMSEventList: []
    };

    serviceAdapter: RecordAttendanceServiceAdapter;

    currentAttendanceList = [];
    messageService: any;
    inPagePermissionMappedByKey: { [key: string]: valueType; };

    constructor(
        private excelService: ExcelService,
        private printServie: PrintService,
        public notificationService: NotificationService,
        public smsService: SmsService,
        public userService: UserService,
        public attendanceService: AttendanceService,
        public studentService: StudentService,
        public smsOldService: SmsOldService,
        public classService: ClassService,
        public employeeService: EmployeeService,
        public tcService: TCService
    ) { }

    // ----------------- Starts : Triggers for sorting ---------------

    triggerSortAscendingByRoll(): void {
        this.studentAttendanceStatusList.sort((a, b) =>
            (a.rollNumber || a.name.toUpperCase()).localeCompare((b.rollNumber || b.name.toUpperCase()), 'en', { numeric: true }));
    }

    triggerSortDescendingByRoll(): void {
        this.studentAttendanceStatusList.sort((a, b) =>
            (b.rollNumber || b.name.toUpperCase()).localeCompare((a.rollNumber || a.name.toUpperCase()), 'en', { numeric: true }));
    }

    triggerSortAscendingByName(): void {
        this.studentAttendanceStatusList.sort((a, b) =>
            (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0));
    }

    triggerSortDescendingByName(): void {
        this.studentAttendanceStatusList.sort((a, b) =>
            (a.name.toUpperCase() > b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0));
    }

    changeSortType(): void {
        if (this.selectedSort.name === this.SORT_BY_ROLL_INC) {
            this.triggerSortAscendingByRoll();
        } else if (this.selectedSort.name === this.SORT_BY_ROLL_DEC) {
            this.triggerSortDescendingByRoll();
        } else if (this.selectedSort.name === this.SORT_BY_NAME_INC) {
            this.triggerSortAscendingByName();
        } else if (this.selectedSort.name === this.SORT_BY_NAME_DEC) {
            this.triggerSortDescendingByName();
        }
    }

    // ----------------- Ends : Triggers for sorting ---------------


    changeSelectedSectionToFirst(): void {
        this.selectedSection = this.selectedClass.sectionList[0];
    }

    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new RecordAttendanceServiceAdapter();
        this.isInitialLoading = true;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.messageService = new MessageService(this.notificationService, this.userService, this.smsService);
    }

    classSectionInPermissionList(classDbId: number, sectionDbId: number, attendancePermissionList: any): boolean {
        let result = false;
        attendancePermissionList.every((item) => {
            if (item.parentDivision === sectionDbId && item.parentClass === classDbId) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    getStudentAttendanceStatusObject(student: any, date: any, attendanceStatusList: any): any {
        let temp = {
            date: date,
            status: null,
        };
        attendanceStatusList.every((studentAttendanceStatus) => {
            if (
                studentAttendanceStatus.parentStudent === student.dbId &&
                new Date(studentAttendanceStatus.dateOfAttendance).getTime() === date.getTime()
            ) {
                temp.status = studentAttendanceStatus.status;
                return false;
            }
            return true;
        });
        return temp;
    }

    getPreviousAttendanceIndex(student, date): any {
        let previousAttendanceIndex = -1;
        let index = 0;
        this.currentAttendanceList.forEach((attendance) => {
            if (attendance.parentStudent == student.dbId && attendance.dateOfAttendance == this.formatDate(date.toString(), '')) {
                previousAttendanceIndex = index;
                return previousAttendanceIndex;
            }
            index = index + 1;
        });
        return previousAttendanceIndex;
    }

    prepareStudentAttendanceStatusListData(): any {
        let studentAttendanceStatusListData = [];
        this.studentAttendanceStatusList.forEach((student) => {
            student.attendanceStatusList.forEach((attendanceStatus) => {
                let previousAttendanceIndex = this.getPreviousAttendanceIndex(student, attendanceStatus.date);
                if (previousAttendanceIndex === -1) {
                    let tempData = {
                        id: null,
                        dateOfAttendance: this.formatDate(attendanceStatus.date.toString(), ''),
                        status: null,
                        parentStudent: student.dbId,
                    };
                    this.currentAttendanceList.push(tempData);
                    previousAttendanceIndex = this.getPreviousAttendanceIndex(student, attendanceStatus.date);
                }
                if (
                    attendanceStatus.status !== null &&
                    attendanceStatus.status !== this.currentAttendanceList[previousAttendanceIndex].status
                ) {
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

    //Checking if it is in mobile
    checkMobile(): any {
        return isMobile();
    }

    // For Printing
    printStudentAttendanceList(): void {
        let value = {
            studentAttendanceList: this.studentAttendanceStatusList,
            startDate: this.startDate,
            endDate: this.endDate,
            by: this.by,
        };
        this.printServie.navigateToPrintRoute(PRINT_STUDENT_ATTENDANCE, { user: this.user, value });
    }

    // For Downloading
    downloadList(): void {
        let template: any;

        template = [this.getHeaderValues()];

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
            this.getDateList().forEach((date) => {
                headerValues.push(date.getDate());
            });
        }

        return headerValues;
    }

    getStudentDisplayInfo(student: any, index: any): any {
        let studentDisplay = [];
        studentDisplay.push(index + 1);
        studentDisplay.push(student.name);
        studentDisplay.push(student.scholarNumber);
        studentDisplay.push(this.getStudentRecord(student));
        student.attendanceStatusList.forEach((attendanceStatus) => {
            studentDisplay.push(this.getButtonString(attendanceStatus.status));
        });

        return studentDisplay;
    }

    // Called from Html files
    declareAllPresent(): void {
        this.studentAttendanceStatusList.forEach((student) => {
            student.attendanceStatusList.forEach((attendanceStatus) => {
                if (attendanceStatus.status !== ATTENDANCE_STATUS_LIST[2]) {
                    attendanceStatus.status = ATTENDANCE_STATUS_LIST[0];
                }
            });
        });
    }

    changeStudentAttendanceStatus(temp: any): void {
        if (!temp.status) {
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
        let nextCounter = (counter + 1) % ATTENDANCE_STATUS_LIST.length;
        if (nextCounter === 2) {
            nextCounter = (nextCounter + 2) % ATTENDANCE_STATUS_LIST.length;
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

        while (tempDate <= lastDate) {
            dateList.push(new Date(tempDate));
            tempDate.setDate(tempDate.getDate() + 1);
        }

        return dateList;
    }

    getButtonClass(status: any): any {
        let classs = 'btn';
        switch (status) {
            case ATTENDANCE_STATUS_LIST[2]:
                classs += ' btn-warning';
                break;
            case ATTENDANCE_STATUS_LIST[1]:
                classs += ' btn-danger';
                break;
            case ATTENDANCE_STATUS_LIST[0]:
                classs += ' btn-success';
                break;
        }
        return classs;
    }

    getButtonString(status: any): any {
        let result = 'N';
        if (status) {
            result = status.substring(0, 1);
        }
        return result;
    }

    getStatusNumber(status: any): any {
        let count = 0;
        if (status === undefined) {
            this.studentAttendanceStatusList.forEach((student) => {
                student.attendanceStatusList.forEach((attendanceStatus) => {
                    if (attendanceStatus.status === null) {
                        count = count + 1;
                    }
                });
            });
        } else {
            this.studentAttendanceStatusList.forEach((student) => {
                student.attendanceStatusList.forEach((attendanceStatus) => {
                    if (attendanceStatus.status === status) {
                        count = count + 1;
                    }
                });
            });
        }
        return count;
    }

    getStudentRecord(student: any): any {
        let absentCount = 0,
            totalCount = 0;
        student.attendanceStatusList.forEach((attendanceStatus) => {
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
        dateStr = dateStr.substr(dateStr.length - 2, 2);
        return student.name + ', ' + dateStr;
    }

    hasAdminPermission(): boolean {
        return this.inPagePermissionMappedByKey[USER_PERMISSION_KEY] == ADMIN_PERMSSION;
    }
}
