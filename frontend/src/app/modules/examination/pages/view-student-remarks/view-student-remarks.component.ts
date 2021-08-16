import { Component, OnInit } from '@angular/core';

import { ViewStudentRemarksServiceAdapter } from './view-student-remarks.service.adapter';

import { DataStorage } from '@classes/data-storage';
import { ExaminationService } from '@services/modules/examination/examination.service';
import { ClassService } from '@services/modules/class/class.service';
import { EmployeeService } from '@services/modules/employee/employee.service';
import { StudentService } from '@services/modules/student/student.service';
import { ViewStudentRemarksHtmlAdapter } from '@modules/examination/pages/view-student-remarks/view-student-remarks.html.adapter';
import {valueType} from '@modules/common/in-page-permission';
import {ADMIN_PERMSSION, USER_PERMISSION_KEY} from './view-student-remarks.permissions';
import {AttendanceService} from '@services/modules/attendance/attendance.service';

@Component({
    selector: 'view-student-remarks',
    templateUrl: './view-student-remarks.component.html',
    styleUrls: ['./view-student-remarks.component.css'],
    providers: [ExaminationService, ClassService, EmployeeService, StudentService, AttendanceService],
})
export class ViewStudentRemarksComponent implements OnInit {
    user;

    classSectionList = [];
    studentSectionList = [];
    studentList = [];
    studentRemarkList = [];
    examinationList = [];

    inPagePermissionMappedByKey: { [key: string]: valueType; };

    serviceAdapter: ViewStudentRemarksServiceAdapter;
    htmlAdapter: ViewStudentRemarksHtmlAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(
        public classService: ClassService,
        public employeeService: EmployeeService,
        public studentService: StudentService,
        public examinationService: ExaminationService,
        public attendanceService: AttendanceService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ViewStudentRemarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.htmlAdapter = new ViewStudentRemarksHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);
    }

    hasAdminPermission(): boolean {
        return this.inPagePermissionMappedByKey[USER_PERMISSION_KEY] == ADMIN_PERMSSION;
    }
}
