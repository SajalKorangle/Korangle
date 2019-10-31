import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../../common-service-requirements';

@Injectable()
export class AttendanceOldService extends CommonServiceRequirements {

    // Student Attendance
    recordStudentAttendance(data: any, token: any): Promise<any> {
        const url = '/attendance-old/student-attendances/batch';
        return super.postData(data, token, url);
    }

    getStudentAttendanceList(data: any, token: any): Promise<any> {
        const url = '/attendance-old/student-attendances?startDate='
            + data['startDate'] + '&endDate=' + data['endDate']
            + '&studentIdList=' + data['studentIdList'];
        return super.getData(token, url);
    }

    deleteStudentAttendance(data: any, token: any): Promise<any> {
        const url = '/attendance-old/student-attendances?startDate='
            + data['startDate'] + '&endDate=' + data['endDate']
            + '&studentIdList=' + data['studentIdList'];
        return super.deleteData(token, url);
    }

    // Employee Attendance
    recordEmployeeAttendance(data: any, token: any): Promise<any> {
        const url = '/attendance-old/employee-attendances/batch';
        return super.postData(data, token, url);
    }

    getEmployeeAttendanceList(data: any, token: any): Promise<any> {
        const url = '/attendance-old/employee-attendances?startDate='
            + data['startDate'] + '&endDate=' + data['endDate']
            + '&employeeIdList=' + data['employeeIdList'];
        return super.getData(token, url);
    }

    deleteEmployeeAttendance(data: any, token: any): Promise<any> {
        const url = '/attendance-old/employee-attendances?startDate='
            + data['startDate'] + '&endDate=' + data['endDate']
            + '&employeeIdList=' + data['employeeIdList'];
        return super.deleteData(token, url);
    }

    // Employee Applied Leave
    recordEmployeeAppliedLeaveList(data: any, token: any): Promise<any> {
        const url = '/attendance-old/employee-applied-leaves/batch';
        return super.postData(data, token, url);
    }

    updateEmployeeAppliedLeaveList(data: any, token: any): Promise<any> {
        const url = '/attendance-old/employee-applied-leaves/batch';
        return super.putData(data, token, url);
    }

    getEmployeeAppliedLeaveList(data: any, token: any): Promise<any> {
        const url = '/attendance-old/employee-applied-leaves?startDate='
            + data['startDate'] + '&endDate=' + data['endDate']
            + '&employeeIdList=' + data['employeeIdList'];
        return super.getData(token, url);
    }

    // Attendance Permission
    getAttendancePermissionList(data: any, token: any): Promise<any> {
        const url = '/attendance-old/attendance-permissions-old?parentEmployee='
            + data['parentEmployee'] + '&sessionId=' + data['sessionId'];
        return super.getData(token, url);
    }

    giveAttendancePermission(data: any, token: any): Promise<any> {
        const url = '/attendance-old/attendance-permissions-old';
        return super.postData(data, token, url);
    }

    deleteAttendancePermission(data: any, token: any): Promise<any> {
        const url = '/attendance-old/attendance-permissions-old/' + data['id'];
        return super.deleteData(token, url);
    }

}
