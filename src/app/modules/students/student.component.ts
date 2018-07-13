import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<update-profile *ngIf="user.section.subRoute===\'update_profile\'" [user]="user"></update-profile>' +
    '<view-all *ngIf="user.section.subRoute===\'view_all\'" [user]="user"></view-all>' +
    '<generate-tc *ngIf="user.section.subRoute===\'generate_tc\'" [user]="user"></generate-tc>' +
    '<promote-student *ngIf="user.section.subRoute===\'promote_student\'" [user]="user"></promote-student>' +
    '<change-class *ngIf="user.section.subRoute===\'change_class\'" [user]="user"></change-class>' +
    '<add-student *ngIf="user.section.subRoute===\'add_student\'" [user]="user"></add-student>' +
    '<upload-list *ngIf="user.section.subRoute===\'upload_list\'" [user]="user"></upload-list>',
})

export class StudentComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
