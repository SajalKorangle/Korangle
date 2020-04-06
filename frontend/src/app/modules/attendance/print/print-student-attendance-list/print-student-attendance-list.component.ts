import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import {ATTENDANCE_STATUS_LIST} from '../../classes/constants';
import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-student-attendance-list.component.html',
    styleUrls: ['./print-student-attendance-list.component.css'],
})
export class PrintStudentAttendanceListComponent implements OnInit, AfterViewChecked {

    @Input() user;

    studentAttendanceList: any;
    startDate: any;
    endDate: any;
    by: any;

    viewChecked = true;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user; 
        this.studentAttendanceList = value['studentAttendanceList'];
        this.startDate = value['startDate'];
        this.endDate = value['endDate'];
        this.by = value['by'];
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.studentAttendanceList = null;
            this.cdRef.detectChanges();
        }
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

    getStatus(status: any): any {
        let result = 'N';
        if (status) {
            result = status.substring(0,1);
        }
        return result;
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

    getTextClass(status: any): any {
        let classs = "";
        switch (status) {
            case ATTENDANCE_STATUS_LIST[3]:
                classs += "text-info";
                break;
            case ATTENDANCE_STATUS_LIST[2]:
                classs += "text-warning";
                break;
            case ATTENDANCE_STATUS_LIST[1]:
                classs += "text-danger";
                break;
            case ATTENDANCE_STATUS_LIST[0]:
                classs += "text-success";
                break;
        }
        return classs;
    }

}
