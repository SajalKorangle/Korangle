import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<update-profile *ngIf="user.section.subRoute===\'update_profile\'" [user]="user"></update-profile>' +
    '<view-all *ngIf="user.section.subRoute===\'view_all\'" [user]="user"></view-all>' +
    '<add-employee *ngIf="user.section.subRoute===\'add_employee\'" [user]="user"></add-employee>' +
    '<assign-task *ngIf="user.section.subRoute===\'assign_task\'" [user]="user"></assign-task>' +
    '<i-cards *ngIf="user.section.subRoute===\'employee_i_card\'" [user]="user"></i-cards>',
})

export class EmployeeComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
