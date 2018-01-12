import { Component } from '@angular/core';

import { Concession } from '../classes/concession';
import { EmitterService } from '../services/emitter.service';
import { ConcessionListService } from "../services/concession-list.service";

@Component({
  selector: 'app-concession',
  templateUrl: './concession.component.html',
  styleUrls: ['./concession.component.css'],
    providers: [ConcessionListService]
})
export class ConcessionComponent {

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

    constructor(private concessionListService: ConcessionListService) { }

    getConcessionList(): void {
      this.concessionList = [];
      this.isLoading = true;
      this.concessionListService.getConcessionList(this.startDate, this.endDate).then(
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
