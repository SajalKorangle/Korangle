import {Component, Input, OnInit} from '@angular/core';

import {StudentService} from '../../../../services/modules/student/student.service';

import { ATTENDANCE_STATUS_LIST } from '../../classes/constants';

import { ExcelService } from '../../../../excel/excel-service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_STUDENT_ATTENDANCE } from '../../../../print/print-routes.constants';
import {DataStorage} from '../../../../classes/data-storage';
import { SmsService } from '../../../../services/modules/sms/sms.service';
import {NotificationService} from '../../../../services/modules/notification/notification.service';
import {UserService} from '../../../../services/modules/user/user.service';
import { RecordAttendanceServiceAdapter } from './record-attendance.service.adapter';
import { AttendanceService } from '../../../../services/modules/attendance/attendance.service';
import { SmsOldService } from '../../../../services/modules/sms/sms-old.service';
import { ClassService } from '../../../../services/modules/class/class.service';


@Component({
  selector: 'record-attendance',
  templateUrl: './record-attendance.component.html',
  styleUrls: ['./record-attendance.component.css'],
    providers: [
        NotificationService,
        SmsService,
        UserService,
        AttendanceService,
        StudentService,
        SmsOldService,
        ClassService
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
    studentAlternateMessage = "Your ward's attendance has been corrected to <attendanceStatus>";

    sentTypeList = [
        'NULL',
        'SMS',
        'NOTIFICATION',
        'NOTIF./SMS',
    ];

    studentList :any;

    selectedSentType :any;
    smsBalance = 0;
    
    receiverList = [
        'All Students',
        'Only Absent Students'
    ];

    selectedReceiver :any;

    notif_usernames = [];

    serviceAdapter: RecordAttendanceServiceAdapter
    
    currentAttendanceList = [];

    constructor (private excelService: ExcelService,
                 private printServie: PrintService,
                 public notificationService: NotificationService,
                 public smsService: SmsService,
                 public userService: UserService,
                 public attendanceService: AttendanceService,
                 public studentService: StudentService,
                 public smsOldService: SmsOldService,
                 public classService: ClassService,
                 ) { }

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
        
        this.isLoading = true;
        this.showStudentList = true;
        this.currentAttendanceList = [];

        let data = {
            parentStudent__in : this.getStudentIdList(),
            dateOfAttendance__gte : this.startDate,
            dateOfAttendance__lte : this.endDate    
        }

        this.attendanceService.getObjectList(this.attendanceService.student_attendance, data).then(attendanceList =>{
            this.isLoading = false;
            attendanceList.forEach(element =>{
                this.currentAttendanceList.push(element);
            });
            this.populateStudentAttendanceList(attendanceList);
        },error => {
            this.isLoading = false;
        });
        
    }

    populateStudentAttendanceList(attendanceList: any) {
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
        this.serviceAdapter.fetchGCMDevices(this.studentAttendanceStatusList);
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
            return;
        }
        const promises = [];
        let toCreateAttendance = [];
        let toUpdateAttendance = [];
        data.forEach(attendance =>{
            let tempData = {
                dbId : attendance.parentStudent,
            }
            let previousAttendanceIndex = this.getPreviousAttendanceIndex(tempData, new Date(attendance.dateOfAttendance));
            if(this.currentAttendanceList[previousAttendanceIndex].id == null){
                toCreateAttendance.push(attendance);
            }
            else{
                let tempData = {
                    id : this.currentAttendanceList[previousAttendanceIndex].id,
                    dateOfAttendance : attendance.dateOfAttendance,
                    status: attendance.status,
                    parentStudent: attendance.parentStudent,
                }
                toUpdateAttendance.push(tempData);
            }
        })
        promises.push(this.attendanceService.createObjectList(this.attendanceService.student_attendance, toCreateAttendance));
        toUpdateAttendance.forEach(attendance =>{
            promises.push(this.attendanceService.updateObject(this.attendanceService.student_attendance, attendance));
        });
        this.isLoading = true;
        Promise.all(promises).then(response =>{
            this.isLoading = false;
            response[0].forEach(element =>{
                let tempData = {
                    dbId : element.parentStudent,
                }
                let previousAttendanceIndex = this.getPreviousAttendanceIndex(tempData, new Date(element.dateOfAttendance));
                this.currentAttendanceList[previousAttendanceIndex].status = element.status;
                this.currentAttendanceList[previousAttendanceIndex].id = element.id;
            })
            for(let i=1; i<response.length; i++){
                let tempData = {
                    dbId : response[i].parentStudent,
                }
                let previousAttendanceIndex = this.getPreviousAttendanceIndex(tempData, new Date(response[i].dateOfAttendance));
                this.currentAttendanceList[previousAttendanceIndex].status = response[i].status;
            }
            alert('Student Attendance recorded successfully');
            this.notifyParents();
        }, error => {
            this.isLoading = false;
        });
    }


    getPreviousAttendanceIndex(student, date): any{
        let previousAttendanceIndex = -1;
        let index = 0;
        this.currentAttendanceList.forEach(attendance =>{
            if(attendance.parentStudent == student.dbId && attendance.dateOfAttendance == this.formatDate(date.toString(), '')){
                previousAttendanceIndex = index;
                return previousAttendanceIndex;
            }
            index = index+1;
        });
        return previousAttendanceIndex;
    };

    prepareStudentAttendanceStatusListData(): any {
        let studentAttendanceStatusListData = [];
        this.studentAttendanceStatusList.forEach(student => {
            student.attendanceStatusList.forEach(attendanceStatus => {
                let previousAttendanceIndex = this.getPreviousAttendanceIndex(student, attendanceStatus.date);
                if(previousAttendanceIndex === -1 ){
                    let tempData = {
                        id: null,
                        dateOfAttendance : this.formatDate(attendanceStatus.date.toString(), ''),
                        status: null,
                        parentStudent: student.dbId,
                    }
                    this.currentAttendanceList.push(tempData);
                    previousAttendanceIndex = this.getPreviousAttendanceIndex(student, attendanceStatus.date);
                }
                if (attendanceStatus.status !== null && attendanceStatus.status !== this.currentAttendanceList[previousAttendanceIndex].status) {
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
            this.studentList = [];
            this.studentAttendanceStatusList.forEach(student => {
                student.attendanceStatusList.forEach(attendanceStatus => {
                    let previousAttendanceIndex = this.getPreviousAttendanceIndex(student, attendanceStatus.date);
                    if(this.currentAttendanceList[previousAttendanceIndex].status !== attendanceStatus.status){
                        if (attendanceStatus.status !== null && this.checkMobileNumber(student.mobileNumber) == true ){
                            if(attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                                let tempData = {
                                    name: student.name,
                                    dateOfAttendance: this.formatDate(attendanceStatus.date.toString(), ''),
                                    attendanceStatus: attendanceStatus.status,
                                    mobileNumber: student.mobileNumber,
                                    notification: student.notification,
                                    messageType: 1
                                };
                                if(this.currentAttendanceList[previousAttendanceIndex].status !== null ){
                                    tempData.messageType= 2
                                }
                                this.studentList.push(tempData);
                            }
                            if(this.selectedReceiver == this.receiverList[0] && attendanceStatus.status === ATTENDANCE_STATUS_LIST[0]){
                                let tempData = {
                                    name: student.name,
                                    dateOfAttendance: this.formatDate(attendanceStatus.date.toString(), ''),
                                    attendanceStatus: attendanceStatus.status,
                                    mobileNumber: student.mobileNumber,
                                    notification: student.notification,
                                    messageType: 1
                                };
                                if(this.currentAttendanceList[previousAttendanceIndex].status !== null ){
                                    tempData.messageType= 2
                                }
                                this.studentList.push(tempData);
                            }
                        }
                    }
                });
                
            });
            let currentDate = new Date();
            if(this.studentList.length > 0 && this.selectedSentType != 'NULL'  && this.by == 'date' && this.startDate == this.formatDate(currentDate, '')){
                this.serviceAdapter.sendSMSNotification(this.studentList);
            }
    }

    checkMobileNumber(mobileNumber: number): boolean {
        if (mobileNumber && mobileNumber.toString().length == 10) {
            return true;
        }
        return false;
    }

    getMessageFromTemplate = (message, obj) => {
        let ret = message;
        for(let key in obj){
            ret = ret.replace('<'+key+'>', obj[key]);
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
