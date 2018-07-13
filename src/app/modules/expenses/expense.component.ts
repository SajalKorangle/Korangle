import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../classes/data-storage';

@Component({
    template: '<expense-list  *ngIf="user.section.subRoute===\'expense_list\'" [user]="user"></expense-list>' +
    '<add-expense *ngIf="user.section.subRoute===\'add_expense\'" [user]="user"></add-expense>',
})

export class ExpenseComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
