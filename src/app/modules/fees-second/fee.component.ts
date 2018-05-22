import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<app-collect-fee *ngIf="user.activeTask.path===\'collect_fee\'" [user]="user"></app-collect-fee>' +
    '<app-total-collection *ngIf="user.activeTask.path===\'total_collection\'" [user]="user"></app-total-collection>' +
    '<app-school-fee-record *ngIf="user.activeTask.path===\'school_fee_record\'" [user]="user"></app-school-fee-record>' +
    '<app-update-student-fees *ngIf="user.activeTask.path===\'update_student_fees\'" [user]="user"></app-update-student-fees>' +
    '<app-give-discount *ngIf="user.activeTask.path===\'give_discount\'" [user]="user"></app-give-discount>' +
    '<app-total-discount *ngIf="user.activeTask.path===\'total_discount\'" [user]="user"></app-total-discount>' +
    '<app-set-school-fees *ngIf="user.activeTask.path===\'set_school_fees\'" [user]="user"></app-set-school-fees>' +
    '<app-approve-fees *ngIf="user.activeTask.path===\'approve_fees\'" [user]="user"></app-approve-fees>',
})

export class FeeComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
