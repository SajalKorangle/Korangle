import { Component, OnInit } from '@angular/core';

import { GradeStudentFieldsServiceAdapter } from './grade-student-fields.service.adapter';

import { GRADE_LIST } from "../../../../../services/modules/report-card/cbse/constants";

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../../classes/data-storage";
import {ExaminationService} from "../../../../../services/modules/examination/examination.service";
import {ReportCardCbseService} from "../../../../../services/modules/report-card/cbse/report-card-cbse.service";
import {ClassService} from "../../../../../services/modules/class/class.service";
import {EmployeeService} from "../../../../../services/modules/employee/employee.service";
import {AttendanceService} from "../../../../../services/modules/attendance/attendance.service";
import {StudentService} from "../../../../../services/modules/student/student.service";

@Component({
    selector: 'grade-student-fields',
    templateUrl: './grade-student-fields.component.html',
    styleUrls: ['./grade-student-fields.component.css'],
    providers: [
        ReportCardCbseService,
        ExaminationService,
        ClassService,
        EmployeeService,
        AttendanceService,
        StudentService
    ],
})

export class GradeStudentFieldsComponent implements OnInit {

    user;

    extraFieldList = [];
    gradeList = GRADE_LIST;
    termList = [];
    classSectionList = [];
    attendancePermissionList = [];
    studentList = [];
    studentSectionList = [];
    studentExtraFieldList = [];

    selectedClassSection: any;
    selectedTerm: any;
    selectedExtraField: any;

    serviceAdapter: GradeStudentFieldsServiceAdapter;

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
        this.serviceAdapter = new GradeStudentFieldsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    showTermList(): boolean {
        if (this.selectedClassSection.class.orderNumber >= 5) {
            return true;
        } else {
            return false;
        }
    }

    handleClassSectionChange(classSection: any): void {
        this.selectedClassSection = classSection;
        if (this.selectedClassSection.class.orderNumber >= 5) {
            this.selectedTerm = this.termList[0];
        } else {
            this.selectedTerm = this.termList[2];
        }
    }

    getFilteredStudentSectionList(): any {
        return this.studentSectionList.filter(studentSection => {
            return studentSection.parentClass == this.selectedClassSection.class.id
                && studentSection.parentDivision == this.selectedClassSection.section.id;
        });
    }

    getStudent(studentSection: any): any {
        return this.studentList.find(student => {
            return student.id == studentSection.parentStudent;
        });
    }

    getGrade(studentSection: any): any {
        let item = this.studentExtraFieldList.find(studentExtraField => {
            return studentExtraField.parentStudent == studentSection.parentStudent;
        });
        if (item) {
            return item.grade;
        } else {
            return null;
        }
    }

    getButtonString(studentSection: any): any {
        let grade = this.getGrade(studentSection);
        if (grade) {
            return grade;
        } else {
            return 'N';
        }
    }

    getButtonClass(studentSection: any): any {
        let grade = this.getGrade(studentSection);
        let classs = "btn";
        switch (grade) {
            case this.gradeList[0]:
                classs += " btn-success";
                break;
            case this.gradeList[1]:
                classs += " btn-warning";
                break;
            case this.gradeList[2]:
                classs += " btn-danger";
                break;
        }
        return classs;
    }

    changeStudentGrade(studentSection: any): void {
        let item = this.studentExtraFieldList.find(studentExtraField => {
            return studentExtraField.parentStudent == studentSection.parentStudent;
        });
        if (item) {
            switch (item.grade) {
                case this.gradeList[0]:
                    item.grade = this.gradeList[1];
                    break;
                case this.gradeList[1]:
                    item.grade = this.gradeList[2];
                    break;
                case this.gradeList[2]:
                    item.grade = this.gradeList[0];
                    break;
            }
        } else {
            let item = {
                'parentStudent': studentSection.parentStudent,
                'parentSession': this.vm.user
            };
            return null;
        }
    }

    /*detectChanges(): void {
        this.showTestDetails = false;
        this.cdRef.detectChanges();
    }*/

    /*getStudentName(studentId: any): any {
        let result = '';
        this.studentList.every(item => {
            if (item.dbId === studentId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }*/

}
