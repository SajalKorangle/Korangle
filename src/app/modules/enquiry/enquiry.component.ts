import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<update-enquiry *ngIf="user.section.subRoute===\'update_enquiry\'" [user]="user"></update-enquiry>' +
    '<view-all *ngIf="user.section.subRoute===\'view_all\'" [user]="user"></view-all>' +
    '<add-enquiry *ngIf="user.section.subRoute===\'add_enquiry\'" [user]="user"></add-enquiry>',
})

export class EnquiryComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
