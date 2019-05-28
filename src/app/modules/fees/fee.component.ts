import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<collect-student-fee *ngIf="user.section.subRoute===\'collect_student_fee\'" [user]="user"></collect-student-fee>' +
    '<my-collection *ngIf="user.section.subRoute===\'my_collection\'" [user]="user"></my-collection>' +
    '<total-collection *ngIf="user.section.subRoute===\'total_collection\'" [user]="user"></total-collection>' +
    '<view-defaulters *ngIf="user.section.subRoute===\'view_defaulters\'" [user]="user"></view-defaulters>' +
    '<generate-fees-certificate *ngIf="user.section.subRoute===\'generate_fees_certificate\'" [user]="user"></generate-fees-certificate>' +
    '<generate-fees-report *ngIf="user.section.subRoute===\'generate_fees_report\'" [user]="user"></generate-fees-report>' +
    '<give-parent-discount *ngIf="user.section.subRoute===\'give_parent_discount\'" [user]="user"></give-parent-discount>' +
    '<give-student-discount *ngIf="user.section.subRoute===\'give_student_discount\'" [user]="user"></give-student-discount>' +
    '<total-discount *ngIf="user.section.subRoute===\'total_discount\'" [user]="user"></total-discount>' +
    '<cancel-fee-receipt *ngIf="user.section.subRoute===\'cancel_fee_receipt\'" [user]="user"></cancel-fee-receipt>' +
    '<cancel-discount *ngIf="user.section.subRoute===\'cancel_discount\'" [user]="user"></cancel-discount>' +
    '<update-student-fees *ngIf="user.section.subRoute===\'update_student_fees\'" [user]="user"></update-student-fees>' +
    '<set-school-fees *ngIf="user.section.subRoute===\'set_school_fees\'" [user]="user"></set-school-fees>' +
    '<add-fee-type *ngIf="user.section.subRoute===\'add_fee_type\'" [user]="user"></add-fee-type>' +
    '<lock-fees *ngIf="user.section.subRoute===\'lock_fees\'" [user]="user"></lock-fees>'
})

export class FeeComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
