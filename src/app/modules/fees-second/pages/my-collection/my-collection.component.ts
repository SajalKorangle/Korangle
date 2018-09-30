import { Component, Input } from '@angular/core';

import { FeeService } from '../../fee.service';

import { FeeReceipt } from '../../classes/common-functionalities';

@Component({
  selector: 'my-collection',
  templateUrl: './my-collection.component.html',
  styleUrls: ['./my-collection.component.css'],
    providers: [FeeService]
})
export class MyCollectionComponent {

    @Input() user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();

    // feesList = [];

    feeReceiptList: any;

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

    getEmployeeFeeReceiptList(): void {
        const data = {
            startDate: this.startDate,
            endDate: this.endDate,
            parentEmployee: this.user.activeSchool.employeeId,
        };
        this.isLoading = true;
        this.feeReceiptList = null;
        this.feeService.getEmployeeFeeReceiptList(data, this.user.jwt).then(feeReceiptList => {
            this.isLoading = false;
            this.feeReceiptList = feeReceiptList;
        }, error => {
            this.isLoading = false;
        });
    }

    getEmployeeFeeTotalAmount(): number {
        let amount = 0;
        this.feeReceiptList.forEach( feeReceipt => {
            amount += FeeReceipt.getFeeReceiptTotalAmount(feeReceipt);
        });
        return amount;
    }

    /*printFeeRecords(): void {
        const emitValue = [];
        emitValue['feesList'] = this.feesList;
        emitValue['startDate'] = this.startDate;
        emitValue['endDate'] = this.endDate;
        emitValue['totalFees'] = this.totalFees;
        EmitterService.get('print-fee-records').emit(emitValue);
    }*/

    /*printFeeReceipt(fee: Fee): void {
        EmitterService.get('print-fee-receipt').emit(fee);
    }*/

}
