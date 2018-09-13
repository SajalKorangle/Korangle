import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<record-attendance *ngIf="user.section.subRoute===\'record_student_attendance\'" [user]="user"></record-attendance>' +
    '<record-employee-attendance *ngIf="user.section.subRoute===\'record_employee_attendance\'" [user]="user"></record-employee-attendance>' +
    '<declare-holidays *ngIf="user.section.subRoute===\'declare_holidays\'" [user]="user"></declare-holidays>' +
    '<give-permissions *ngIf="user.section.subRoute===\'give_permissions\'" [user]="user"></give-permissions>',
})

export class AttendanceComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
