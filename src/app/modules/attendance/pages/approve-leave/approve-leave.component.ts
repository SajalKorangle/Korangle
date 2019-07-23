import { Component, Input, OnInit } from '@angular/core';

import {AttendanceService} from '../../attendance.service';
import {EmployeeService} from '../../../employee/employee.service';

import { ApproveLeaveServiceAdapter } from './approve-leave.service.adapter';
import {SESSION_LIST} from '../../../../classes/constants/session';
import {LEAVE_OPTION_LIST, LEAVE_STATUS_LIST} from '../../classes/constants';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'approve-leave',
    templateUrl: './approve-leave.component.html',
    styleUrls: ['./approve-leave.component.css'],
    providers: [ AttendanceService, EmployeeService ],
})

export class ApproveLeaveComponent implements OnInit {

     user;

    employeeMiniProfileList: any;

    employeeSessionList: any;

    employeeList: any;

    serviceAdapter: ApproveLeaveServiceAdapter;

    statusList = [];

    selectedStatus: any;

    sessionList = SESSION_LIST;

    leave_status_list = LEAVE_STATUS_LIST;

    leave_option_list = LEAVE_OPTION_LIST;

    selectedSession = SESSION_LIST[1];

    isLoading = false;

    constructor(public attenendanceService: AttendanceService,
                public employeeService: EmployeeService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        LEAVE_STATUS_LIST.forEach(status => {
            this.statusList.push(status);
        });
        this.statusList.push('ALL');

        this.selectedStatus = this.statusList[0];

        this.serviceAdapter = new ApproveLeaveServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.getEmployeeLeaveDetails();

    }

    showEmployeeList(employee: any): boolean {
        let result = false;
        employee.originalAppliedLeaveList.every(appliedLeave => {
            if (appliedLeave.status === this.selectedStatus ||
                this.selectedStatus === this.statusList[this.statusList.length-1]) {
                result = true;
                return false;
            }
            return true;
        });
        return result
    }

    getDayLength(halfDay: boolean): any {
        return (halfDay?'Half Day': 'Full Day');
    }

    paidOrUnpaid(paid: boolean): any {
        return (paid?'Paid': 'Unpaid');
    }

    getPendingLeaves(employee: any): number {
        let result = 0;
        employee.originalAppliedLeaveList.forEach(appliedLeave => {
            if (appliedLeave.status === LEAVE_STATUS_LIST[0]) {
                result += 1;
            }
        });
        return result;
    }

    getLeftPaidLeaves(employee: any): number {
        let result = 0;
        this.employeeSessionList.every(employeeSession => {
            if (employeeSession.parentEmployee === employee.id) {
                result = employeeSession.paidLeaveNumber;
            }
        });
        employee.originalAppliedLeaveList.forEach(appliedLeave => {
            if (appliedLeave.paidLeave) {
                result -= 1;
            }
        });
        return result;
    }

    getButtonClass(status: any): any {
        let classs = "btn";
        switch (status) {
            case LEAVE_STATUS_LIST[2]:
                classs += " btn-danger";
                break;
            case LEAVE_STATUS_LIST[1]:
                classs += " btn-success";
                break;
            case LEAVE_STATUS_LIST[0]:
                classs += " btn-warning";
                break;
        }
        return classs;
    }

    changeAppliedLeaveStatus(appliedLeave: any): void {
        let counter = 0;
        for (let i = 0; i < LEAVE_STATUS_LIST.length; ++i) {
            if (LEAVE_STATUS_LIST[i] === appliedLeave.status) {
                counter = i;
                break;
            }
        }
        let nextCounter = (counter+1)%LEAVE_STATUS_LIST.length;
        appliedLeave.status = LEAVE_STATUS_LIST[nextCounter];
    }

}
