import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<app-collect-fee *ngIf="user.section.subRoute===\'collect_fee\'" [user]="user"></app-collect-fee>' +
    '<my-collection *ngIf="user.section.subRoute===\'my_collection\'" [user]="user"></my-collection>' +
    '<app-total-collection *ngIf="user.section.subRoute===\'total_collection\'" [user]="user"></app-total-collection>' +
    '<app-school-fee-record *ngIf="user.section.subRoute===\'school_fee_record\'" [user]="user"></app-school-fee-record>' +
    '<app-update-student-fees *ngIf="user.section.subRoute===\'update_student_fees\'" [user]="user"></app-update-student-fees>' +
    '<app-give-discount *ngIf="user.section.subRoute===\'give_discount\'" [user]="user"></app-give-discount>' +
    '<app-total-discount *ngIf="user.section.subRoute===\'total_discount\'" [user]="user"></app-total-discount>' +
    '<app-set-school-fees *ngIf="user.section.subRoute===\'set_school_fees\'" [user]="user"></app-set-school-fees>' +
    '<app-approve-fees *ngIf="user.section.subRoute===\'approve_fees\'" [user]="user"></app-approve-fees>',
})

export class FeeComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
