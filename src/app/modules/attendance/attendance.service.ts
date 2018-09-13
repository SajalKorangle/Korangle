import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../../services/common-service-requirements';

@Injectable()
export class AttendanceService extends CommonServiceRequirements {

    // Student Attendance
    recordStudentAttendance(data: any, token: any): Promise<any> {
        const url = '/attendance/student-attendances/batch';
        return super.postData(data, token, url);
    }

    getStudentAttendanceList(data: any, token: any): Promise<any> {
        const url = '/attendance/student-attendances?startDate='
            + data['startDate'] + '&endDate=' + data['endDate']
            + '&studentIdList=' + data['studentIdList'];
        return super.getData(token, url);
    }

    deleteStudentAttendance(data: any, token: any): Promise<any> {
        const url = '/attendance/student-attendances?startDate='
            + data['startDate'] + '&endDate=' + data['endDate']
            + '&studentIdList=' + data['studentIdList'];
        return super.deleteData(token, url);
    }

    // Employee Attendance
    recordEmployeeAttendance(data: any, token: any): Promise<any> {
        const url = '/attendance/employee-attendances/batch';
        return super.postData(data, token, url);
    }

    getEmployeeAttendanceList(data: any, token: any): Promise<any> {
        const url = '/attendance/employee-attendances?startDate='
            + data['startDate'] + '&endDate=' + data['endDate']
            + '&employeeIdList=' + data['employeeIdList'];
        return super.getData(token, url);
    }

    deleteEmployeeAttendance(data: any, token: any): Promise<any> {
        const url = '/attendance/employee-attendances?startDate='
            + data['startDate'] + '&endDate=' + data['endDate']
            + '&employeeIdList=' + data['employeeIdList'];
        return super.deleteData(token, url);
    }

    // Attendance Permission
    getAttendancePermissionList(data: any, token: any): Promise<any> {
        const url = '/attendance/attendance-permissions?parentSchool='
            + data['parentSchool'] + '&parentUser=' + data['parentUser']
            + '&sessionId=' + data['sessionId'];
        return super.getData(token, url);
    }

    giveAttendancePermission(data: any, token: any): Promise<any> {
        const url = '/attendance/attendance-permissions';
        return super.postData(data, token, url);
    }

    deleteAttendancePermission(data: any, token: any): Promise<any> {
        const url = '/attendance/attendance-permissions/' + data['id'];
        return super.deleteData(token, url);
    }

}
