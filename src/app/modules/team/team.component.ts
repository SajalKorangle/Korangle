import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<add-member *ngIf="user.section.subRoute===\'add_member\'" [user]="user"></add-member>' +
    '<assign-task *ngIf="user.section.subRoute===\'assign_task\'" [user]="user"></assign-task>' +
    '<remove-member *ngIf="user.section.subRoute===\'remove_member\'" [user]="user"></remove-member>',
})

export class TeamComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
