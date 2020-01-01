import { Component, OnInit } from '@angular/core';

import { ViewGradesRemarksServiceAdapter } from './view-grades-remarks.service.adapter';

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
    selector: 'view-grades-remarks',
    templateUrl: './view-grades-remarks.component.html',
    styleUrls: ['./view-grades-remarks.component.css'],
    providers: [
        ReportCardCbseService,
        ExaminationService,
        ClassService,
        EmployeeService,
        AttendanceService,
        StudentService
    ],
})

export class ViewGradesRemarksComponent implements OnInit {

    user;

    classSectionList = [];
    studentList = [];
    studentSectionList = [];
    studentRemarkList = [];
    extraFieldList = [];
    termList = [];
    employeeList = [];
    currentEmployees = [];

    selectedClassSection: any;
    selectedExtraField: any;
    selectedTerm: any;

    studentExtraFieldList = [];

    showRemark = true;
    showStudentList = false;

    serviceAdapter: ViewGradesRemarksServiceAdapter;

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
        this.serviceAdapter = new ViewGradesRemarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    handleClassSectionChange(classSection: any): void {
        this.selectedClassSection = classSection;
        if (this.selectedClassSection.class.orderNumber >= 5) {
            this.selectedTerm = this.termList[0];
        } else {
            this.selectedTerm = this.termList[2];
        }
        this.handleTermChange(this.selectedTerm);
    }

    handleTermChange(term: any): void{
        this.selectedTerm = term;
        this.showStudentList = false;
        if(this.showTermList() && term.id==1){
            this.showRemark=false;
        }else{
            this.showRemark = true;
        }
    }

    showTermList(): boolean {
        return this.selectedClassSection.class.orderNumber >= 5;
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

    getStudent(studentSection: any): any {
        return this.studentList.find(student => {
            return student.id == studentSection.parentStudent;
        });
    }

    getStudentRemark(studentSection: any): any {
        let item = this.studentRemarkList.find(studentRemark => {
            return studentRemark.parentStudent == studentSection.parentStudent;
        });
        if (item) {
            return item.remark;
        } else {
            return null;
        }
    }

    getGrade(studentSection: any, index: number): any {
        index = index+1;
        let item = this.studentExtraFieldList[index].find(studentExtraField => {
            return studentExtraField.parentStudent == studentSection.parentStudent;
        });
        if (item) {
            return item.grade;
        } else {
            return null;
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
