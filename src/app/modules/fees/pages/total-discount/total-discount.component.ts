import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { TotalDiscountServiceAdapter } from "./total-discount.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'total-discount',
    templateUrl: './total-discount.component.html',
    styleUrls: ['./total-discount.component.css'],
    providers: [ FeeService ],
})

export class TotalDiscountComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: TotalDiscountServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new TotalDiscountServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
