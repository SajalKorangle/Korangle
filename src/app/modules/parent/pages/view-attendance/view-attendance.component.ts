import { Component, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';

import { AttendanceService } from '../../../attendance/attendance.service';
import {ATTENDANCE_STATUS_LIST} from '../../../attendance/classes/constants';
import {DataStorage} from "../../../../classes/data-storage";
import {CommonFunctions} from "../../../../classes/common-functions";

export interface CalendarDate {
    mDate: moment.Moment;
}

@Component({
    selector: 'view-attendance',
    templateUrl: './view-attendance.component.html',
    styleUrls: ['./view-attendance.component.css', './view-attendance.component.scss'],
    providers: [AttendanceService]
})

export class ViewAttendanceComponent implements OnInit, OnChanges {

    user;

    currentMoment: any;
    weeks: any;
    dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    startDate = null;
    endDate = null;

    attendanceStatusList = null;

    ATTENDANCE_STATUS_LIST = ATTENDANCE_STATUS_LIST;

    showCalendar = false;
    isLoading = false;

    constructor (private attendanceService: AttendanceService) { }

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
        this.getStudentAttendanceStatusList();
    }

    getStudentAttendanceStatusList(): void {

        let data = {
            studentIdList: [this.user.section.student.id],
            startDate: this.startDate,
            endDate: this.endDate,
        };

        this.isLoading = true;
        this.showCalendar = false;

        this.attendanceService.getStudentAttendanceList(data, this.user.jwt).then(attendanceList => {
            this.isLoading = false;
            this.attendanceStatusList = attendanceList;
            this.showCalendar = true;
            this.generateCalendar();
        }, error => {
            this.isLoading = false;
        });

    }

    getDateColor(date: any): any {
        let result = '';
        this.attendanceStatusList.every(attendanceStatus => {
            if(attendanceStatus.dateOfAttendance === this.formatDate(date.mDate.toString(),'')) {
                if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[0]) {
                    result = 'green';
                } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                    result = 'red';
                } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[2]) {
                    result = 'orange';
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
        const numberTobeAdded = Math.ceil((numberOfDays+firstOfMonth)/7)*7;

        return CommonFunctions.getArrayFromRange(start, start+numberTobeAdded)
            .map((date: number): CalendarDate => {
                const d = moment(firstDayOfGrid).date(date);
                return {
                    mDate: d,
                };
            });
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
        this.attendanceStatusList.forEach(attendanceStatus => {
            if (attendanceStatus.status === status) {
                result += 1;
            }
        });
        return result;
    }

}
