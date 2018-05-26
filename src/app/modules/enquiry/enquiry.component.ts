import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<update-enquiry *ngIf="user.activeTask.path===\'update_enquiry\'" [user]="user"></update-enquiry>' +
    '<view-all *ngIf="user.activeTask.path===\'view_all\'" [user]="user"></view-all>' +
    '<add-enquiry *ngIf="user.activeTask.path===\'add_enquiry\'" [user]="user"></add-enquiry>',
})

export class EnquiryComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
