import { Component, OnInit } from '@angular/core';

import { AddRemarksServiceAdapter } from './add-student-remarks.service.adapter';

import { isMobile } from '../../../../../classes/common.js'

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../../classes/data-storage";
import {ExaminationService} from '@services/modules/examination/examination.service';
import {ReportCardMpBoardService} from "../../../../../services/modules/report-card/mp-board/report-card-mp-board.service";
import {ClassService} from "../../../../../services/modules/class/class.service";
import {EmployeeService} from "../../../../../services/modules/employee/employee.service";
import {AttendanceService} from "../../../../../services/modules/attendance/attendance.service";
import {StudentService} from "../../../../../services/modules/student/student.service";
import {AddStudentRemarksHtmlAdapter} from '@modules/examination/pages/add-student-remarks/add-student-remarks.html.adapter';

declare const $: any;

@Component({
    selector: 'add-student-remarks',
    templateUrl: './add-student-remarks.component.html',
    styleUrls: ['./add-student-remarks.component.css'],
    providers: [
        ReportCardMpBoardService,
        ExaminationService,
        ClassService,
        EmployeeService,
        AttendanceService,
        StudentService
    ],
})

export class AddStudentRemarksComponent implements OnInit {

    user;

    classSectionList = [];
    attendancePermissionList = [];
    studentSectionList = [];
    studentList = [];
    studentRemarkList = [];

    selectedClassSection: any;

    showStudentList = false;


    serviceAdapter: AddRemarksServiceAdapter;
    htmlAdapter: AddStudentRemarksHtmlAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(public reportCardMpBoardService: ReportCardMpBoardService,
                public classService: ClassService,
                public employeeService: EmployeeService,
                public attendanceService: AttendanceService,
                public studentService: StudentService,
                public examinationService: ExaminationService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new AddRemarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.htmlAdapter = new AddStudentRemarksHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);
    }

    handleClassSectionChange(classSection: any): void {
        this.selectedClassSection = classSection;
    }

    getFilteredStudentSectionList(): any {
        return this.studentSectionList.filter(studentSection => {
            return studentSection.parentClass === this.selectedClassSection.class.id
                && studentSection.parentDivision === this.selectedClassSection.section.id;
        }).sort( (a, b) => {
            if (a.rollNumber && b.rollNumber) {
                return a.rollNumber - b.rollNumber;
            }
        });
    }

    getTotalStudentsCount(): any {
        return this.getFilteredStudentSectionList().length;
    }

    getRemarkedStudentsCount(): any {
        return this.studentRemarkList.filter(item => {
            if (item.remark !== '') {
                return true;
            }
            return false;
        }).length;
    }

    getStudentRemark(studentSection: any): any {
        const item = this.studentRemarkList.find(studentRemark => {
            return studentRemark.parentStudent === studentSection.parentStudent;
        });
        if (item) {
            return item.remark;
        } else {
            return '';
        }
    }

    isMobile(): boolean {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

}
