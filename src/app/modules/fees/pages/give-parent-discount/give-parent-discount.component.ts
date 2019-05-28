import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { GiveParentDiscountServiceAdapter } from "./give-parent-discount.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'give-parent-discount',
    templateUrl: './give-parent-discount.component.html',
    styleUrls: ['./give-parent-discount.component.css'],
    providers: [ FeeService ],
})

export class GiveParentDiscountComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: GiveParentDiscountServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new GiveParentDiscountServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
