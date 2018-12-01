import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<set-class-subject *ngIf="user.section.subRoute===\'set_class_subject\'" [user]="user"></set-class-subject>' +
    '<set-student-subject *ngIf="user.section.subRoute===\'set_student_subject\'" [user]="user"></set-student-subject>',
})

export class SubjectComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
