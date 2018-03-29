import { Component, Input } from '@angular/core';
import * as Chartist from 'chartist';

import { ExpenseService} from '../expense.service';
import { Expense } from '../../classes/expense';
import {EmitterService} from '../../services/emitter.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
    providers: [ ExpenseService ]
})

export class ExpenseListComponent {

    @Input() user;

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

    constructor(private expenseService: ExpenseService) { }

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
      data['schoolDbId'] = this.user.schoolDbId;

      this.displayStartDate = this.startDate;
      this.displayEndDate = this.endDate;

      this.expenseService.getExpenseList(data, this.user.jwt).then(
          expenseList => {
              // for (let i = 0; i < 10000; ++i ) { }
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
                          /*labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                          series: [
                              [12, 17, 7, 17, 23, 18, 38]
                          ]*/
                          labels: this.dateLabels,
                          series: [
                              this.totalExpensesDatesWise
                          ]
                      };

                      const optionsExpenseChart: any = {
                          lineSmooth: Chartist.Interpolation.cardinal({
                              tension: 0
                          }),
                          low: 0,
                          high: this.maxTotalExpenseInADate, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
                      };


                      const expenseChart = new Chartist.Line('#expenseChart', dataExpenseChart, optionsExpenseChart);

                      this.startAnimationForLineChart(expenseChart);
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

    startAnimationForLineChart(chart) {
        let seq: any, delays: any, durations: any;
        seq = 0;
        delays = 80;
        durations = 500;

        chart.on('draw', function(data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            } else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq = 0;
    };


    printExpenses(): void {
        const emitValue = [];
        emitValue['expenseList'] = this.expenseList;
        emitValue['startDate'] = this.startDate;
        emitValue['endDate'] = this.endDate;
        emitValue['totalExpenses'] = this.totalExpenses;
        EmitterService.get('print-expenses').emit(emitValue);
    }

}
