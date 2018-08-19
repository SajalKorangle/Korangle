import {Component, Input} from '@angular/core';

import { AttendanceService } from '../../attendance.service';

@Component({
  selector: 'declare-holidays',
  templateUrl: './declare-holidays.component.html',
  styleUrls: ['./declare-holidays.component.css'],
})

export class DeclareHolidaysComponent {

    @Input() user;

    newEmployee: any;

    isLoading = false;

    constructor (private attendanceService: AttendanceService) { }

}
