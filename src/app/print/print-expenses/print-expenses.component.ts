import { Component, OnInit } from '@angular/core';

import { Expense } from '../../classes/expense';

import { EmitterService } from '../../services/emitter.service';
import set = Reflect.set;
import moment = require("moment");

@Component({
    selector: 'print-expenses',
    templateUrl: './print-expenses.component.html',
    styleUrls: ['./print-expenses.component.css'],
})
export class PrintExpensesComponent implements OnInit {

    expenseList: any;
    startDate: any;
    endDate: any;
    totalExpense = 0;

    ngOnInit(): void {
        EmitterService.get('print-expenses-component').subscribe( value => {
            this.expenseList = value['expenseList'];
            this.startDate = moment(value['startDate']).format('DD-MM-YYYY');
            this.endDate = moment(value['endDate']).format('DD-MM-YYYY');
            this.totalExpense = value['totalConcession'];
            setTimeout(() => {
                window.print();
            });
        });
    }

}
