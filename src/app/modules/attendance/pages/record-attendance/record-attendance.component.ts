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

    }

}
