import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<record-attendance *ngIf="user.activeTask.path===\'record_attendance\'" [user]="user"></record-attendance>' +
    '<declare-holidays *ngIf="user.activeTask.path===\'declare_holidays\'" [user]="user"></declare-holidays>' +
    '<give-permissions *ngIf="user.activeTask.path===\'give_permissions\'" [user]="user"></give-permissions>',
})

export class AttendanceComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
