import { Component, OnInit } from '@angular/core';

import { AddStudentRemarksServiceAdapter } from './add-student-remarks.service.adapter';

import { isMobile } from '../../../../../classes/common.js'

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../../classes/data-storage";
import {ExaminationService} from "../../../../../services/modules/examination/examination.service";
import {ReportCardCbseService} from "../../../../../services/modules/report-card/cbse/report-card-cbse.service";
import {ClassService} from "../../../../../services/modules/class/class.service";
import {EmployeeService} from "../../../../../services/modules/employee/employee.service";
import {AttendanceService} from "../../../../../services/modules/attendance/attendance.service";
import {StudentService} from "../../../../../services/modules/student/student.service";

declare const $: any;

@Component({
    selector: 'add-student-remarks',
    templateUrl: './add-student-remarks.component.html',
    styleUrls: ['./add-student-remarks.component.css'],
    providers: [
        ReportCardCbseService,
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
    studentRemarkList = [];

    selectedClassSection: any;

    showStudentList = false;

    serviceAdapter: AddStudentRemarksServiceAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(public reportCardCbseService: ReportCardCbseService,
                public classService: ClassService,
                public employeeService: EmployeeService,
                public attendanceService: AttendanceService,
                public studentService: StudentService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new AddStudentRemarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    handleClassSectionChange(classSection: any): void {
        this.selectedClassSection = classSection;
    }

    getFilteredStudentSectionList(): any {
        return this.studentSectionList.filter(studentSection => {
            return studentSection.parentClass == this.selectedClassSection.class.id
                && studentSection.parentDivision == this.selectedClassSection.section.id;
        }).sort( (a,b) => {
            if (a.rollNumber && b.rollNumber) {
                return a.rollNumber - b.rollNumber;
            }
        });
    }
    
    getTotalStudents(): any {
        return this.getFilteredStudentSectionList().length;
    }

    getRemarkedStudentsCount(): any {
        return this.studentRemarkList.filter(item=>{
            if(item.remark != '') return true;
            return false;
        }).length;
    }

    getStudentRemark(studentSection: any): any {
        let item = this.studentRemarkList.find(studentRemark => {
            return studentRemark.parentStudent == studentSection.parentStudent;
        });
        if (item) {
            return item.remark;
        } else {
            return '';
        }
    }

    isMobile(): boolean {
        //return isMobile();
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

}
