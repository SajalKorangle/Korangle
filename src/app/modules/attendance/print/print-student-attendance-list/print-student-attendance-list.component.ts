import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';
import {ATTENDANCE_STATUS_LIST} from '../../classes/constants';

@Component({
    selector: 'print-student-attendance-list',
    templateUrl: './print-student-attendance-list.component.html',
    styleUrls: ['./print-student-attendance-list.component.css'],
})
export class PrintStudentAttendanceListComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    studentAttendanceList: any;
    startDate: any;
    endDate: any;
    by: any;

    viewChecked = true;

    printStudentAttendanceListComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.printStudentAttendanceListComponentSubscription =
            EmitterService.get('print-student-attendance-list-component').subscribe( value => {
                this.studentAttendanceList = value['studentAttendanceList'];
                this.startDate = value['startDate'];
                this.endDate = value['endDate'];
                this.by = value['by'];
                this.viewChecked = false;
        });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.studentAttendanceList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printStudentAttendanceListComponentSubscription.unsubscribe();
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

}
