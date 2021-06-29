import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class AttendanceService extends ServiceObject {
    protected module_url = '/attendance';

    // objects urls
    public employee_attendance = '/employee-attendance';
    public student_attendance = '/student-attendance';
    public employee_applied_leave = '/employee-applied-leave';
    public attendance_permission = '/attendance-permission';
    public attendance_settings = '/attendance-settings';
}
