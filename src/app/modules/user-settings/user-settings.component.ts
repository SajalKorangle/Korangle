import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<update-profile *ngIf="user.section.subRoute===\'update_profile\'" [user]="user"></update-profile>' +
    '<change-password *ngIf="user.section.subRoute===\'change_password\'" [user]="user"></change-password>' +
    '<contact-us *ngIf="user.section.subRoute===\'contact_us\'" [user]="user"></contact-us>',
})

export class UserSettingsComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
