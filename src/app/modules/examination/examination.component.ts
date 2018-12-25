import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<create-examination *ngIf="user.section.subRoute===\'create_examination\'" [user]="user"></create-examination>' +
    '<create-test *ngIf="user.section.subRoute===\'create_test\'" [user]="user"></create-test>' +
    '<generate-hall-ticket *ngIf="user.section.subRoute===\'generate_hall_ticket\'" [user]="user"></generate-hall-ticket>' +
    '<update-class-marks *ngIf="user.section.subRoute===\'update_marks\'" [user]="user"></update-class-marks>' +
    '<examination-print-marksheet *ngIf="user.section.subRoute===\'print_marksheet\'" [user]="user"></examination-print-marksheet>'
})

export class ExaminationComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
