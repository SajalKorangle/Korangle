import {Component, Input, OnInit} from '@angular/core';

import { AttendanceService } from '../../attendance.service';
import {ClassService} from '../../../../services/class.service';
import {StudentService} from '../../../students/student.service';

@Component({
  selector: 'record-attendance',
  templateUrl: './record-attendance.component.html',
  styleUrls: ['./record-attendance.component.css'],
    providers: [ AttendanceService, ClassService, StudentService ],
})

export class RecordAttendanceComponent implements OnInit {

    @Input() user;

    attendancePermissionList: any;

    classSectionList: any;

    studentList: any;

    isLoading = false;

    constructor (private attendanceService: AttendanceService,
                 private classService: ClassService,
                 private studentService: StudentService) { }

    ngOnInit(): void {

        let request_attendance_permission_list_data = {
            parentUser: this.user.id,
            parentSchool: this.user.activeSchool.dbId,
            sessionId: this.user.activeSchool.currentSessionDbId,
        };

        let request_student_data = {
            schoolDbId: this.user.activeSchool.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };

        this.isLoading = true;

        Promise.all([
            this.attendanceService.getAttendancePermissionList(request_attendance_permission_list_data, this.user.jwt),
            this.studentService.getClassSectionStudentList(request_student_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        });

    }

}
