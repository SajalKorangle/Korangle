import { Component, OnInit } from '@angular/core';
import { CountAllStudentAttendanceServiceAdapter } from './count-all-student-attendance.service.adapter';
import { DataStorage } from '@classes/data-storage';
import { CLASS_CONSTANT } from '@services/modules/class/models/classs';

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
    counter : any;

    constructor( ) { }

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
}
