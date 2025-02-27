import { Component, Input, OnInit } from '@angular/core';

import { ExpenseOldService } from '../../../../services/modules/expense/expense-old.service';
import { Expense } from '../../../../classes/expense';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'add-expense',
    templateUrl: './add-expense.component.html',
    styleUrls: ['./add-expense.component.css'],
    providers: [ExpenseOldService],
})
export class AddExpenseComponent implements OnInit {
    user;

    currentExpenseList: Expense[] = [];

    isLoading = false;
    newExpense: Expense;

    totalExpenses = 0;

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.newExpense = new Expense();
        this.newExpense.voucherDate = this.todaysDate();
    }

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return year + '-' + month + '-' + day;
    }

    constructor(private expenseService: ExpenseOldService) {}

    submitExpense(): void {
        if (this.newExpense.amount === undefined || this.newExpense.amount === 0 || this.newExpense.amount === null) {
            alert('Amount should be populated');
            return;
        }
        if (this.newExpense.remark === undefined) {
            this.newExpense.remark = '';
        }
        this.isLoading = true;

        const expenseData = {};
        expenseData['amount'] = this.newExpense.amount;
        expenseData['remark'] = this.newExpense.remark;
        expenseData['voucherDate'] = this.newExpense.voucherDate;
        expenseData['schoolDbId'] = this.user.activeSchool.dbId;

        this.expenseService.submitExpense(expenseData, this.user.jwt).then(
            (data) => {
                this.isLoading = false;

                const tempExpense = new Expense();
                tempExpense.voucherNumber = data.voucherNumber;
                tempExpense.voucherDate = data.voucherDate;
                tempExpense.amount = data.amount;
                tempExpense.remark = data.remark;
                this.currentExpenseList.push(tempExpense);
                this.totalExpenses += tempExpense.amount;

                this.newExpense = new Expense();
                this.newExpense.voucherDate = this.todaysDate();
            },
            (error) => {
                this.isLoading = false;
                alert('Server error: Contact Admin');
            }
        );
    }
}
