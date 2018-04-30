import { Component, Input } from '@angular/core';

import { FeeService } from '../../fee.service';

import { Concession } from '../../classes/common-functionalities';

@Component({
  selector: 'app-total-discount',
  templateUrl: './total-discount.component.html',
  styleUrls: ['./total-discount.component.css'],
    providers: [FeeService]
})
export class TotalDiscountComponent {

    @Input() user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();

    concessionList: any;

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

    getSchoolConcessionList(): void {
        const data = {
            startDate: this.startDate,
            endDate: this.endDate,
            schoolDbId: this.user.schoolDbId,
        };
        this.isLoading = true;
        this.concessionList = null;
        this.feeService.getSchoolConcessionList(data, this.user.jwt).then(concessionList => {
            this.isLoading = false;
            this.concessionList = concessionList;
            console.log(this.concessionList);
        }, error => {
            this.isLoading = false;
        });
    }

    getSchoolConcessionListTotalAmount(): number {
        return Concession.getConcessionListTotalAmount(this.concessionList);
    }

}
