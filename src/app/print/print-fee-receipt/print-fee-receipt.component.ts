import { Component, OnInit } from '@angular/core';

import { Fee } from '../../classes/fee';

import { EmitterService } from '../../services/emitter.service';
import set = Reflect.set;

@Component({
    selector: 'print-fee-receipt',
    templateUrl: './print-fee-receipt.component.html',
    styleUrls: ['./print-fee-receipt.component.css'],
})
export class PrintFeeReceiptComponent implements OnInit {

    feeReceipt: Fee;

    ngOnInit(): void {
        this.feeReceipt = new Fee();
        EmitterService.get('print-fee-receipt-component').subscribe( value => {
            this.feeReceipt.copy(value);
            setTimeout(() => {
                window.print();
                console.log('nice printing');
            });
        });
    }

}
