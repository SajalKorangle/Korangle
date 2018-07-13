import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<send-sms *ngIf="user.section.subRoute===\'send_sms\'" [user]="user"></send-sms>' +
    '<view-sent *ngIf="user.section.subRoute===\'view_sent\'" [user]="user"></view-sent>' +
    '<view-purchases *ngIf="user.section.subRoute===\'view_purchases\'" [user]="user"></view-purchases>',
})

export class SmsComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
