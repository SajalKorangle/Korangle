import {Component, Input} from '@angular/core';

import { AttendanceService } from '../../attendance.service';

@Component({
  selector: 'view-class-attendance',
  templateUrl: './view-class-attendance.component.html',
  styleUrls: ['./view-class-attendance.component.css'],
})

export class ViewClassAttendanceComponent {

    @Input() user;

    newEmployee: any;

    isLoading = false;

    constructor (private attendanceService: AttendanceService) { }

}
