import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<add-member *ngIf="user.activeTask.path===\'add_member\'" [user]="user"></add-member>' +
    '<assign-task *ngIf="user.activeTask.path===\'assign_task\'" [user]="user"></assign-task>' +
    '<remove-member *ngIf="user.activeTask.path===\'remove_member\'" [user]="user"></remove-member>',
})

export class TeamComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
