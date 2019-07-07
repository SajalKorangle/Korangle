import {Component, Input, OnInit} from '@angular/core';

import { AttendanceService } from '../../attendance.service';
import {ClassService} from '../../../../services/class.service';
import {StudentOldService} from '../../../students/student-old.service';

import { ATTENDANCE_STATUS_LIST } from '../../classes/constants';

import { ExcelService } from "../../../../excel/excel-service";
import { PrintService } from '../../../../print/print-service';
import { PRINT_STUDENT_ATTENDANCE } from '../../../../print/print-routes.constants';

@Component({
  selector: 'record-attendance',
  templateUrl: './record-attendance.component.html',
  styleUrls: ['./record-attendance.component.css'],
    providers: [
        AttendanceService,
        ClassService,
        StudentOldService,
    ],
})

export class RecordAttendanceComponent implements OnInit {

    @Input() user;

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

    constructor (private attendanceService: AttendanceService,
                 private studentService: StudentOldService,
                 private excelService: ExcelService,
                 private printServie: PrintService) { }

    changeSelectedSectionToFirst(): void {
        this.selectedSection = this.selectedClass.sectionList[0];
    }


    // Server Handling - Initial
    ngOnInit(): void {

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
                                scholarNumber: student.scholarNumber
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

}
