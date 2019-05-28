import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { CancelFeeReceiptServiceAdapter } from "./cancel-fee-receipt.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'cancel-fee-receipt',
    templateUrl: './cancel-fee-receipt.component.html',
    styleUrls: ['./cancel-fee-receipt.component.css'],
    providers: [ FeeService ],
})

export class CancelFeeReceiptComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: CancelFeeReceiptServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new CancelFeeReceiptServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
