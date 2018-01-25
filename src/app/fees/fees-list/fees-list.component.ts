import { Component, Input } from '@angular/core';

import { FeeListService } from '../../services/fee-list.service';
import { Fee } from '../../classes/fee';
import {EmitterService} from '../../services/emitter.service';

@Component({
  selector: 'app-fees-list',
  templateUrl: './fees-list.component.html',
  styleUrls: ['./fees-list.component.css'],
    providers: [FeeListService]
})
export class FeesListComponent {

    @Input() user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();
    feesList: Fee[] = [];
    totalFees = 0;
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

    constructor(private feeListService: FeeListService) { }

    getFeeList(): void {
      this.feesList = [];
      this.isLoading = true;
      this.feeListService.getFeeList(this.startDate, this.endDate).then(
          feesList => {
              console.log(feesList);
              // for (let i = 0; i < 10000; ++i ) { }
              this.totalFees = 0;
              this.isLoading = false;
              this.feesList = feesList;
              this.feesList.forEach(fee => {
                  this.totalFees += fee.amount;
              });
          }, error => {
              this.isLoading = false;
          }
      );
    }

    printFeeRecords(): void {
        const emitValue = [];
        emitValue['feesList'] = this.feesList;
        emitValue['startDate'] = this.startDate;
        emitValue['endDate'] = this.endDate;
        emitValue['totalFees'] = this.totalFees;
        EmitterService.get('print-fee-records').emit(emitValue);
    }

    printFeeReceipt(fee: Fee): void {
        EmitterService.get('print-fee-receipt').emit(fee);
    }

}
