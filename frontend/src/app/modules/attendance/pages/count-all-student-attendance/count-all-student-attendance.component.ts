import { Component, OnInit } from '@angular/core';
import { CountAllStudentAttendanceServiceAdapter } from './count-all-student-attendance.service.adapter';
import { DataStorage } from '@classes/data-storage';
import {isMobile} from "../../../../classes/common";
import { PrintService } from 'app/print/print-service';
import { ExcelService } from 'app/excel/excel-service';
import { PRINT_STUDENT_ATTENDANCE_COUNT } from 'app/print/print-routes.constants';
import { ShowStudentListModalComponent } from './component/show-student-list-modal/show-student-list-modal.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'count-all-student-attendance',
    templateUrl: './count-all-student-attendance.component.html',
    styleUrls: ['./count-all-student-attendance.component.css']
})
export class CountAllStudentAttendanceComponent implements OnInit {

    serviceAdapter: CountAllStudentAttendanceServiceAdapter;
    user: any;
    isLoading: boolean;
    classList: any;
    studentSectionList: any;
    divisionList: any;
    showStudentList = false;
    attendanceList: any;
    initialDate: Date;
    selectedDate: Date;
    studentsWithTc = [];
    isInitialLoading = true;

    constructor(
        private printService: PrintService,
        private excelService: ExcelService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new CountAllStudentAttendanceServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.initialDate = new Date();
    }

    onDateSelected(event) {
        this.selectedDate = event;
        this.showStudentList = false;
    }

    checkMobile() {
        return isMobile();
    }

    /* Open Table Format Name Dialog */
    openShowStudentListDialog(studentSectionList: any): void {
        const dialogRef = this.dialog.open(ShowStudentListModalComponent, {
            data: {
                studentList: studentSectionList,
            }
        });
    }  // Ends: openShowStudentListDialog()

    getHeaderValues() {
        let headerValues = [];
        headerValues.push('Class');
        headerValues.push('Present');
        headerValues.push('Absent');
        headerValues.push('Holiday');
        headerValues.push('Not Recorded');
        headerValues.push('Total');
        return headerValues;
    }

    getDisplayInfo(divisionsAttendanceInfo: any) {
        let result = [];
        Object.keys(divisionsAttendanceInfo).forEach(sections => {
            if (sections !== 'name') {
                let arr = [];
                arr.push(divisionsAttendanceInfo['name'] + " " + sections);
                arr.push(divisionsAttendanceInfo[sections]['PRESENT']);
                arr.push(divisionsAttendanceInfo[sections]['ABSENT']);
                arr.push(divisionsAttendanceInfo[sections]['HOLIDAY']);
                arr.push(divisionsAttendanceInfo[sections]['NOT_RECORDED']);
                arr.push(divisionsAttendanceInfo[sections]['TOTAL']);
                result.push(arr);
            }
        });
        return result;
    }

    //For downloading
    downloadList(): void {
        let template: any;

        template = [this.getHeaderValues()];

        this.attendanceList.forEach((attendanceRecord) => {
            let arr = this.getDisplayInfo(attendanceRecord);
            arr.forEach(item => template.push(item));
        });

        this.excelService.downloadFile(template, 'korangle_student_attendance_count.csv');
    }

    printStudentAttendanceCountList(): void {
        let value = {
            studentAttendanceCountList : this.attendanceList,
            dateSelected : this.selectedDate
        };
        return this.printService.navigateToPrintRoute(PRINT_STUDENT_ATTENDANCE_COUNT, { user: this.user, value });
    }
}
