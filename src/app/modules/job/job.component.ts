import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<view-profile *ngIf="user.section.subRoute===\'view_profile\'" [user]="user"></view-profile>' +
    '<view-attendance *ngIf="user.section.subRoute===\'view_attendance\'" [user]="user"></view-attendance>' +
    '<apply-leave *ngIf="user.section.subRoute===\'apply_leave\'" [user]="user"></apply-leave>',
})

export class JobComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
