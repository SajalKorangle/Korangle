import { Component, OnInit } from '@angular/core';

import { ExpenseOldService} from '../../../../services/modules/expense/expense-old.service';
import { Expense } from '../../../../classes/expense';
import { PrintService } from '../../../../print/print-service';
import { PRINT_EXPENSES } from '../../../../print/print-routes.constants';
import { DataStorage } from "../../../../classes/data-storage";

@Component({
  selector: 'expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
    providers: [ ExpenseOldService ]
})

export class ExpenseListComponent implements OnInit {

    user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();
    expenseList: Expense[] = [];
    totalExpenses = 0;
    isLoading = false;

    displayStartDate = this.todaysDate();
    displayEndDate = this.todaysDate();

    dateLabels = [];
    totalExpensesDatesWise = [];
    maxTotalExpenseInADate = 0;
    maxTotalExpenseDate: any;


    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return year + '-' + month + '-' + day;
    }

    constructor(private expenseService: ExpenseOldService, private printService: PrintService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    getExpenseList(): void {
      this.expenseList = [];
      this.isLoading = true;

      if (!this.startDate || this.startDate === '') {
          alert('Start Date should be populated');
          return;
      } else if (!this.endDate || this.endDate === '') {
          alert('End Date should be populated');
          return;
      }

      const data = {};
      data['startDate'] = this.startDate;
      data['endDate'] = this.endDate;
      data['schoolDbId'] = this.user.activeSchool.dbId;

      this.displayStartDate = this.startDate;
      this.displayEndDate = this.endDate;

      this.expenseService.getExpenseList(data, this.user.jwt).then(
          expenseList => {
              this.totalExpenses = 0;
              this.isLoading = false;
              this.expenseList = expenseList;

              if (this.expenseList.length === 0) {
                  alert('no records were found between these dates');
              }

              this.maxTotalExpenseInADate = 0;
              this.dateLabels = [];
              this.maxTotalExpenseDate = '';
              this.totalExpensesDatesWise = [];

              this.expenseList.forEach(expense => {
                  this.totalExpenses += expense.amount;

                  if (this.dateLabels.length === 0) {
                      this.dateLabels.push(expense.voucherDate);
                      this.totalExpensesDatesWise.push(expense.amount);
                      this.updateMaxTotalExpenseInADate(this.totalExpensesDatesWise[this.totalExpensesDatesWise.length - 1],
                          expense.voucherDate);
                  } else if (this.dateLabels[this.dateLabels.length - 1] === expense.voucherDate) {
                      this.totalExpensesDatesWise[this.totalExpensesDatesWise.length - 1] += expense.amount;
                      this.updateMaxTotalExpenseInADate(this.totalExpensesDatesWise[this.totalExpensesDatesWise.length - 1],
                          expense.voucherDate);
                  } else {
                      this.dateLabels.push(expense.voucherDate);
                      this.totalExpensesDatesWise.push(expense.amount);
                      this.updateMaxTotalExpenseInADate(this.totalExpensesDatesWise[this.totalExpensesDatesWise.length - 1],
                          expense.voucherDate);
                  }
              });

              if (this.dateLabels.length > 1 && this.displayEndDate !== this.displayStartDate) {
                  setTimeout( () => {
                      const dataExpenseChart: any = {
                          labels: this.dateLabels,
                          series: [
                              this.totalExpensesDatesWise
                          ]
                      };
                  } );
              }

          }, error => {
              this.isLoading = false;
              alert('Server error: Contact Admin');
          }
      );
    }

    updateMaxTotalExpenseInADate(expense: any, date: any): void {
        if (this.maxTotalExpenseInADate < expense) {
            this.maxTotalExpenseInADate = expense;
            this.maxTotalExpenseDate = date;
        }
    }


    printExpenses(): void {
        const value = [];
        value['expenseList'] = this.expenseList;
        value['startDate'] = this.startDate;
        value['endDate'] = this.endDate;
        value['totalExpenses'] = this.totalExpenses;
        this.printService.navigateToPrintRoute(PRINT_EXPENSES, {user: this.user, value});
    }

}
