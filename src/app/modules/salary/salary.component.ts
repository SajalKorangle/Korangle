import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<generate-payslip *ngIf="user.section.subRoute===\'generate_payslip\'" [user]="user"></generate-payslip>' +
    '<record-payment *ngIf="user.section.subRoute===\'record_payment\'" [user]="user"></record-payment>' +
    '<app-print-salary-sheet *ngIf="user.section.subRoute===\'print_salary_sheet\'" [user]="user"></app-print-salary-sheet>' +
    '<view-record *ngIf="user.section.subRoute===\'view_record\'" [user]="user"></view-record>',
})

export class SalaryComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
