import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fee } from '../../classes/fee';

import { EmitterService } from '../../services/emitter.service';
import set = Reflect.set;
import moment = require("moment");

@Component({
    selector: 'print-fee-records',
    templateUrl: './print-fee-records.component.html',
    styleUrls: ['./print-fee-records.component.css'],
})
export class PrintFeeRecordsComponent implements OnInit, OnDestroy {

    feesList: any;
    startDate: any;
    endDate: any;
    totalFees = 0;

    printFeeRecordsComponentSubscription: any;

    ngOnInit(): void {
        EmitterService.get('print-fee-records-component').subscribe( value => {
            console.log('in print fee records component');
            this.feesList = value['feesList'];
            this.startDate = moment(value['startDate']).format('DD-MM-YYYY');
            this.endDate = moment(value['endDate']).format('DD-MM-YYYY');
            this.totalFees = value['totalFees'];
            setTimeout(() => {
                window.print();
            });
        });
    }

    ngOnDestroy(): void {
        this.printFeeRecordsComponentSubscription.unsubscribe();
    }

}
