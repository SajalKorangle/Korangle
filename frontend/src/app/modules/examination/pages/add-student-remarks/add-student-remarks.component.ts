import { Component, OnInit } from '@angular/core';

import { AddStudentRemarksServiceAdapter } from './add-student-remarks.service.adapter';

import { ChangeDetectorRef } from '@angular/core';
import { DataStorage } from '@classes/data-storage';
import { ExaminationService } from '@services/modules/examination/examination.service';
import { ClassService } from '@services/modules/class/class.service';
import { EmployeeService } from '@services/modules/employee/employee.service';
import { AttendanceService } from '@services/modules/attendance/attendance.service';
import { StudentService } from '@services/modules/student/student.service';
import { AddStudentRemarksHtmlAdapter } from '@modules/examination/pages/add-student-remarks/add-student-remarks.html.adapter';
import {valueType} from '@modules/common/in-page-permission';
import {ADMIN_PERMSSION, USER_PERMISSION_KEY} from './add-student-remarks.permissions';

@Component({
    selector: 'add-student-remarks',
    templateUrl: './add-student-remarks.component.html',
    styleUrls: ['./add-student-remarks.component.css'],
    providers: [ExaminationService, ClassService, EmployeeService, AttendanceService, StudentService],
})
export class AddStudentRemarksComponent implements OnInit {
    user;

    classSectionList = [];
    attendancePermissionList = [];
    studentSectionList = [];
    studentList = [];
    studentRemarkList = [];
    examinationList = [];

    inPagePermissionMappedByKey: { [key: string]: valueType; };

    serviceAdapter: AddStudentRemarksServiceAdapter;
    htmlAdapter: AddStudentRemarksHtmlAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(
        public classService: ClassService,
        public employeeService: EmployeeService,
        public attendanceService: AttendanceService,
        public studentService: StudentService,
        public examinationService: ExaminationService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new AddStudentRemarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.htmlAdapter = new AddStudentRemarksHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);
    }

    hasAdminPermission(): boolean {
        return this.inPagePermissionMappedByKey[USER_PERMISSION_KEY] == ADMIN_PERMSSION;
    }
}
