import { Component, Input } from '@angular/core';

import { Concession } from '../../classes/concession';
import { FeeService } from '../../fees/fee.service';

@Component({
  selector: 'app-concession-list',
  templateUrl: './concession-list.component.html',
  styleUrls: ['./concession-list.component.css'],
    providers: [FeeService]
})
export class ConcessionListComponent {

    @Input() user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();
    concessionList: Concession[] = [];
    totalConcession = 0;
    isLoading = false;

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return year + '-' + month + '-' + day;
    }

    constructor(private feeService: FeeService) { }

    getConcessionList(): void {
      this.concessionList = [];
      this.isLoading = true;
      const data = {
          startDate: this.startDate,
          endDate: this.endDate,
      }
      this.feeService.getConcessionList(data, this.user.jwt).then(
          concessionList => {
              // for (let i = 0; i < 10000; ++i ) { }
              this.totalConcession = 0;
              this.isLoading = false;
              this.concessionList = concessionList;
              this.concessionList.forEach(concession => {
                  this.totalConcession += concession.amount;
              });
          }, error => {
              this.isLoading = false;
          }
      );
    }

    /*printFeeRecords(): void {
        const emitValue = [];
        emitValue['concessionList'] = this.concessionList;
        emitValue['startDate'] = this.startDate;
        emitValue['endDate'] = this.endDate;
        emitValue['totalConcession'] = this.totalConcession;
        EmitterService.get('print-fee-records').emit(emitValue);
    }

    printFeeReceipt(fee: Concession): void {
        EmitterService.get('print-fee-receipt').emit(fee);
    }*/

}
