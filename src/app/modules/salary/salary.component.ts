import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<generate-payslip *ngIf="user.section.subRoute===\'generate_payslip\'" [user]="user"></generate-payslip>' +
    '<record-payment *ngIf="user.section.subRoute===\'record_payment\'" [user]="user"></record-payment>',
})

export class SalaryComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
