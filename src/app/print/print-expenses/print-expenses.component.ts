import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Expense } from '../../classes/expense';

import { EmitterService } from '../../services/emitter.service';
import set = Reflect.set;
import moment = require('moment');

@Component({
    selector: 'print-expenses',
    templateUrl: './print-expenses.component.html',
    styleUrls: ['./print-expenses.component.css'],
})
export class PrintExpensesComponent implements OnInit, OnDestroy {

    @Input() user;

    expenseList: any;
    startDate: any;
    endDate: any;
    totalExpenses = 0;

    printExpensesComponentSubscription: any;

    ngOnInit(): void {
        this.printExpensesComponentSubscription = EmitterService.get('print-expenses-component').subscribe( value => {
            this.expenseList = value['expenseList'];
            this.startDate = moment(value['startDate']).format('DD-MM-YYYY');
            this.endDate = moment(value['endDate']).format('DD-MM-YYYY');
            this.totalExpenses = value['totalExpenses'];
            setTimeout(() => {
                window.print();
            });
        });
    }

    ngOnDestroy(): void {
        this.printExpensesComponentSubscription.unsubscribe();
    }

}
