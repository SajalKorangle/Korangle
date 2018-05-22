import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<update-marks *ngIf="user.activeTask.path===\'update_marks\'" [user]="user"></update-marks>' +
    '<view-marksheet *ngIf="user.activeTask.path===\'print_marksheet\'" [user]="user"></view-marksheet>',
})

export class MarksheetComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
