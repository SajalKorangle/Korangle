import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';

import { AttendanceOldService } from '../../../../services/modules/attendance/attendance-old.service';
import { ATTENDANCE_STATUS_LIST, LEAVE_STATUS_LIST, LEAVE_OPTION_LIST } from '../../../attendance/classes/constants';
import { DataStorage } from '../../../../classes/data-storage';
import { CommonFunctions } from '../../../../classes/common-functions';

export interface CalendarDate {
    mDate: moment.Moment;
    color: any;
    isHalfDay: any;
    attendanceStatus: any;
    leaveStatus: any;
    leaveOption: any;
    inSelectedMonth: any;
}

@Component({
    selector: 'apply-leave',
    templateUrl: './apply-leave.component.html',
    styleUrls: ['./apply-leave.component.css', './apply-leave.component.scss'],
    providers: [AttendanceOldService],
})
export class ApplyLeaveComponent implements OnInit, OnChanges {
    user;
    @Input() studentId;

    currentMoment: any;
    weeks: any;
    dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    startDate = null;
    endDate = null;

    attendanceStatusList = null;
    leaveStatusList = null;

    ATTENDANCE_STATUS_LIST = ATTENDANCE_STATUS_LIST;
    LEAVE_STATUS_LIST = LEAVE_STATUS_LIST;
    leaveLengthList = [];

    showCalendar = false;
    isLoading = false;

    constructor(private attendanceService: AttendanceOldService) {}

    ngOnChanges(): void {
        this.ngOnInit();
    }

    initializeData(): void {
        this.currentMoment = null;
        this.weeks = null;
        this.showCalendar = false;
        this.isLoading = false;
        this.startDate = null;
        this.endDate = null;
        this.attendanceStatusList = null;
        this.leaveLengthList = [];
        Object.keys(LEAVE_OPTION_LIST).forEach((key) => {
            this.leaveLengthList[key] = LEAVE_OPTION_LIST[key];
        });
        this.leaveLengthList.push('NONE');
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.initializeData();
    }

    onMonthSelected(event: any): void {
        this.currentMoment = moment(event);
        this.startDate = this.formatDate(event, 'firstDate');
        this.endDate = this.formatDate(event, 'lastDate');
        this.showCalendar = false;
        this.getEmployeeAttendanceStatusList();
    }

    // Server Handling - 1
    getEmployeeAttendanceStatusList(): void {
        let data = {
            employeeIdList: [this.user.activeSchool.employeeId],
            startDate: this.startDate,
            endDate: this.endDate,
        };

        this.isLoading = true;
        this.showCalendar = false;

        Promise.all([
            this.attendanceService.getEmployeeAttendanceList(data, this.user.jwt),
            this.attendanceService.getEmployeeAppliedLeaveList(data, this.user.jwt),
        ]).then(
            (value) => {
                this.isLoading = false;
                this.attendanceStatusList = value[0];
                this.leaveStatusList = value[1];
                this.showCalendar = true;
                this.generateCalendar();
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    // Server Handling - 2
    prepareEmployeeLeaveData(): any {
        let result = [];
        this.weeks.forEach((week) => {
            week.forEach((day) => {
                if (day.leaveOption !== this.leaveLengthList[2]) {
                    let temp = {
                        parentEmployee: this.user.activeSchool.employeeId,
                        dateOfLeave: this.formatDate(day.mDate.toString(), ''),
                        status: LEAVE_STATUS_LIST[0],
                        halfDay: day.leaveOption === this.leaveLengthList[1],
                        paidLeave: false,
                    };
                    result.push(temp);
                }
            });
        });
        return result;
    }

    applyLeave(): void {
        let data = this.prepareEmployeeLeaveData();

        if (data.length === 0) {
            alert('Nothing to apply');
            return;
        }

        this.isLoading = true;
        this.attendanceService.recordEmployeeAppliedLeaveList(data, this.user.jwt).then(
            (response) => {
                this.isLoading = false;
                this.weeks.forEach((week) => {
                    week.forEach((day) => {
                        if (day.leaveOption !== this.leaveLengthList[2]) {
                            day.leaveOption = null;
                            day.leaveStatus = LEAVE_STATUS_LIST[0];
                        }
                    });
                });
                alert('Leave applied successfully');
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    getDateColor(date: any): any {
        let result = 'blue';
        this.attendanceStatusList.every((attendanceStatus) => {
            if (attendanceStatus.dateOfAttendance === this.formatDate(date.toString(), '')) {
                if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[0]) {
                    result = 'green';
                } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                    result = 'red';
                } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[2]) {
                    result = 'orange';
                } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[3]) {
                    result = 'yellow';
                }
                return false;
            }
            return true;
        });
        return result;
    }

    isHalfDay(date: any): boolean {
        let result = false;
        this.attendanceStatusList.every((attendanceStatus) => {
            if (attendanceStatus.dateOfAttendance === this.formatDate(date.toString(), '')) {
                if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[3]) {
                    result = true;
                }
                return false;
            }
            return true;
        });
        return result;
    }

    // generate the calendar grid
    generateCalendar(): void {
        const dates = this.fillDates(this.currentMoment);
        const weeks: CalendarDate[][] = [];
        while (dates.length > 0) {
            weeks.push(dates.splice(0, 7));
        }
        this.weeks = weeks;
    }

    fillDates(currentMoment: moment.Moment): CalendarDate[] {
        const firstOfMonth = moment(currentMoment).startOf('month').day();
        const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
        const start = firstDayOfGrid.date();
        const numberOfDays = moment(currentMoment).daysInMonth();
        const numberTobeAdded = Math.ceil((numberOfDays + firstOfMonth) / 7) * 7;

        return CommonFunctions.getArrayFromRange(start, start + numberTobeAdded).map(
            (date: number): CalendarDate => {
                const d = moment(firstDayOfGrid).date(date);
                return {
                    mDate: d,
                    color: this.getDateColor(d),
                    isHalfDay: this.isHalfDay(d),
                    attendanceStatus: this.getAttendanceStatusByDate(d),
                    leaveStatus: this.getLeaveStatusByDate(d),
                    leaveOption: this.leaveLengthList[2],
                    inSelectedMonth: this.isSelectedMonth(d),
                };
            }
        );
    }

    getAttendanceStatusByDate(date: any): any {
        let result = null;
        this.attendanceStatusList.every((attendanceStatus) => {
            if (attendanceStatus.dateOfAttendance === this.formatDate(date.toString(), '')) {
                result = attendanceStatus.status;
                return false;
            }
            return true;
        });
        return result;
    }

    getLeaveStatusByDate(date: any): any {
        let result = null;
        this.leaveStatusList.every((leaveStatus) => {
            if (leaveStatus.dateOfLeave === this.formatDate(date.toString(), '')) {
                result = leaveStatus.status;
                return false;
            }
            return true;
        });
        return result;
    }

    // date checkers
    isSelectedMonth(date: moment.Moment): boolean {
        return moment(date).isSame(this.currentMoment, 'month');
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

    getAttendanceStatusNumber(status: any): any {
        let result = 0;
        this.attendanceStatusList.forEach((attendanceStatus) => {
            if (attendanceStatus.status === status) {
                result += 1;
            }
        });
        return result;
    }

    selectDate(day: any): void {
        if (day.attendanceStatus || day.leaveStatus) {
            return;
        }
        this.leaveLengthList.every((option, index) => {
            if (day.leaveOption === option) {
                let nextCounter = (index + 1) % this.leaveLengthList.length;
                day.leaveOption = this.leaveLengthList[nextCounter];
                return false;
            }
            return true;
        });
    }

    getTotalLeave(): any {
        let totalLeavesApplied = 0;
        this.weeks.forEach((week) => {
            week.forEach((day) => {
                if (day.leaveOption === this.leaveLengthList[0]) {
                    totalLeavesApplied += 1;
                } else if (day.leaveOption === this.leaveLengthList[1]) {
                    totalLeavesApplied += 0.5;
                }
            });
        });
        return totalLeavesApplied;
    }
}
