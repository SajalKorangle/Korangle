import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<view-profile *ngIf="user.section.subRoute===\'view_profile\'" [user]="user" [studentId]="user.section.student.id"></view-profile>' +
    '<view-fee *ngIf="user.section.subRoute===\'view_fee\'" [user]="user"></view-fee>' +
    '<view-marks *ngIf="user.section.subRoute===\'view_marks\'" [user]="user" [studentId]="user.section.student.id"></view-marks>' +
    '<view-attendance *ngIf="user.section.subRoute===\'view_attendance\'" [user]="user" [studentId]="user.section.student.id"></view-attendance>',
})

export class ParentComponent implements OnInit {

    user: any;

    constructor() {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
