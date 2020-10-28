import { Component, OnInit } from '@angular/core';

import moment = require('moment');
import { PrintService } from '../../../../print/print-service';

@Component({
    selector: 'print-expenses',
    templateUrl: './print-expenses.component.html',
    styleUrls: ['./print-expenses.component.css'],
})
export class PrintExpensesComponent implements OnInit {

    user: any;

    expenseList: any;
    startDate: any;
    endDate: any;
    totalExpenses = 0;
    constructor(private printService: PrintService) {}
    ngOnInit(): void {
        const {user, value} = this.printService.getData();
        this.user = user;
        this.expenseList = value['expenseList'];
        this.startDate = moment(value['startDate']).format('DD-MM-YYYY');
        this.endDate = moment(value['endDate']).format('DD-MM-YYYY');
        this.totalExpenses = value['totalExpenses'];
        setTimeout(() => {
            this.printService.print();
        });
    }

}
