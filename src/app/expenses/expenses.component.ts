import { Component, Input } from '@angular/core';

import { ExpenseListService } from '../services/expense-list.service';
import { Expense } from '../classes/expense';
import {EmitterService} from '../services/emitter.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
    providers: [ ExpenseListService ]
})

export class ExpensesComponent {

    @Input() user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();
    expenseList: Expense[] = [];
    totalExpenses = 0;
    isLoading = false;
    newExpense = new Expense();

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return year + '-' + month + '-' + day;
    }

    constructor(private expenseListService: ExpenseListService) { }

    getExpenseList(): void {
      this.expenseList = [];
      this.isLoading = true;
      this.expenseListService.getExpenseList(this.startDate, this.endDate).then(
          expenseList => {
              // for (let i = 0; i < 10000; ++i ) { }
              this.totalExpenses = 0;
              this.isLoading = false;
              this.expenseList = expenseList;
              this.expenseList.forEach(expense => {
                  this.totalExpenses += expense.amount;
              });
          }, error => {
              this.isLoading = false;
          }
      );
    }

    submitExpense(): void {
        if (this.newExpense.voucherNumber === undefined || this.newExpense.voucherNumber === 0) {
            alert('Voucher No. should be populated');
            return;
        }
        if (this.newExpense.amount === undefined || this.newExpense.amount === 0) {
            alert('Amount should be populated');
            return;
        }
        if (this.newExpense.remark === undefined) { this.newExpense.remark = ''; }
        this.isLoading = true;
        this.expenseListService.submitExpense(this.newExpense).then(
            data => {
                this.isLoading = false;
                if (data.status === 'success') {
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            }, error => {
                this.isLoading = false;
                alert('Server error: Contact Admin');
            }
        );

    }

    printExpenses(): void {
        const emitValue = [];
        emitValue['expenseList'] = this.expenseList;
        emitValue['startDate'] = this.startDate;
        emitValue['endDate'] = this.endDate;
        emitValue['totalExpenses'] = this.totalExpenses;
        EmitterService.get('print-expenses').emit(emitValue);
    }

}
