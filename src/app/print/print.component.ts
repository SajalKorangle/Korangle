import { Component, OnInit } from '@angular/core';

import { EmitterService } from '../services/emitter.service';

@Component({
    selector: 'app-print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.css'],
})
export class PrintComponent implements OnInit {

    printType = 'feeReceipt';

    ngOnInit(): void {
        EmitterService.get('print-fee-receipt').subscribe( value => {
            console.log('in print component');
            this.printType = 'feeReceipt';
            setTimeout(() => {
                EmitterService.get('print-fee-receipt-component').emit(value);
            });
        });
        EmitterService.get('print-fee-records').subscribe( value => {
            this.printType = 'feeRecords';
            setTimeout(() => {
                EmitterService.get('print-fee-records-component').emit(value);
            });
        });
        EmitterService.get('print-expenses').subscribe( value => {
            this.printType = 'expenses';
            setTimeout(() => {
                EmitterService.get('print-expenses-component').emit(value);
            });
        });
    }

}
