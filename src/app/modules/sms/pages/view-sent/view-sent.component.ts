import { Component, Input } from '@angular/core';

import { SmsService } from '../../sms.service';

@Component({
  selector: 'view-sent',
  templateUrl: './view-sent.component.html',
  styleUrls: ['./view-sent.component.css'],
})
export class ViewSentComponent {

    @Input() user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();

    smsList: any;

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

    constructor(private smsService: SmsService) { }

    getSMSList(): void {
        const data = {
            startDateTime: this.startDate.toString() + ' 00:00:00%2B05:30',
            endDateTime: this.endDate.toString() + ' 23:59:59%2B05:30',
            parentSchool: this.user.activeSchool.dbId,
        };
        this.isLoading = true;
        this.smsList = null;
        this.smsService.getSMSList(data, this.user.jwt).then(smsList => {
            this.isLoading = false;
            this.smsList = smsList;
            console.log(this.smsList);
        }, error => {
            this.isLoading = false;
        });
    }

}
