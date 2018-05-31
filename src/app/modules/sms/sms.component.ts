import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<send-sms *ngIf="user.activeTask.path===\'send_sms\'" [user]="user"></send-sms>' +
    '<view-sent *ngIf="user.activeTask.path===\'view_sent\'" [user]="user"></view-sent>' +
    '<view-purchases *ngIf="user.activeTask.path===\'view_purchases\'" [user]="user"></view-purchases>',
})

export class SmsComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
