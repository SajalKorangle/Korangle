import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { GiveDiscountServiceAdapter } from "./give-discount-service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'give-discount',
    templateUrl: './give-discount.component.html',
    styleUrls: ['./give-discount.component.css'],
    providers: [ FeeService ],
})

export class GiveDiscountComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: GiveDiscountServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new GiveDiscountServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
