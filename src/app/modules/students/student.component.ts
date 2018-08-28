import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<update-profile *ngIf="user.activeTask.path===\'update_profile\'" [user]="user"></update-profile>' +
    '<view-all *ngIf="user.activeTask.path===\'view_all\'" [user]="user"></view-all>' +
    '<generate-tc *ngIf="user.activeTask.path===\'generate_tc\'" [user]="user"></generate-tc>' +
    '<promote-student *ngIf="user.activeTask.path===\'promote_student\'" [user]="user"></promote-student>' +
    '<change-class *ngIf="user.activeTask.path===\'change_class\'" [user]="user"></change-class>' +
    '<add-student *ngIf="user.activeTask.path===\'add_student\'" [user]="user"></add-student>' +
    '<upload-list *ngIf="user.activeTask.path===\'upload_list\'" [user]="user"></upload-list>' +
    '<i-cards *ngIf="user.activeTask.path===\'i_cards\'" [user]="user"></i-cards>',
})

export class StudentComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
