import {Component, Input} from '@angular/core';

import { AttendanceService } from '../../attendance.service';

@Component({
  selector: 'view-student-attendance',
  templateUrl: './view-student-attendance.component.html',
  styleUrls: ['./view-student-attendance.component.css'],
})

export class ViewStudentAttendanceComponent {

    @Input() user;

    newEmployee: any;

    isLoading = false;

    constructor (private attendanceService: AttendanceService) { }

}
