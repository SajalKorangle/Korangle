import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<update-profile *ngIf="user.section.subRoute===\'update_profile\'" [user]="user"></update-profile>' +
    '<view-all *ngIf="user.section.subRoute===\'view_all\'" [user]="user"></view-all>' +
    '<add-employee *ngIf="user.section.subRoute===\'add_employee\'" [user]="user"></add-employee>',
})

export class EmployeeComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
