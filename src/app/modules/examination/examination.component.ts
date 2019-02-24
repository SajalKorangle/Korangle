import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<create-examination *ngIf="user.section.subRoute===\'create_examination\'" [user]="user"></create-examination>' +
    '<create-test *ngIf="user.section.subRoute===\'create_test\'" [user]="user"></create-test>' +
    '<generate-hall-ticket *ngIf="user.section.subRoute===\'generate_hall_ticket\'" [user]="user"></generate-hall-ticket>' +
    '<update-class-marks *ngIf="user.section.subRoute===\'update_marks\'" [user]="user"></update-class-marks>' +
    '<examination-print-marksheet *ngIf="user.section.subRoute===\'print_marksheet\'" [user]="user"></examination-print-marksheet>' +
    '<grade-student-fields *ngIf="user.section.subRoute===\'grade_student_fields\'" [user]="user"></grade-student-fields>' +
    '<set-final-report *ngIf="user.section.subRoute===\'set_final_report\'" [user]="user"></set-final-report>' +
    '<generate-final-report *ngIf="user.section.subRoute===\'generate_final_report\'" [user]="user"></generate-final-report>' +
    '<generate-patrak *ngIf="user.section.subRoute===\'generate_patrak\'" [user]="user"></generate-patrak>' +
    '<generate-goshwara *ngIf="user.section.subRoute===\'generate_goshwara\'" [user]="user"></generate-goshwara>'
})

export class ExaminationComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
