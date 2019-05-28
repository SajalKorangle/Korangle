import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { CancelDiscountServiceAdapter } from "./cancel-discount.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'cancel-discount',
    templateUrl: './cancel-discount.component.html',
    styleUrls: ['./cancel-discount.component.css'],
    providers: [ FeeService ],
})

export class CancelDiscountComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: CancelDiscountServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new CancelDiscountServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
