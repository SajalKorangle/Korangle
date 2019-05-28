import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { GiveStudentDiscountServiceAdapter } from "./give-student-discount.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'give-student-discount',
    templateUrl: './give-student-discount.component.html',
    styleUrls: ['./give-student-discount.component.css'],
    providers: [ FeeService ],
})

export class GiveStudentDiscountComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: GiveStudentDiscountServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new GiveStudentDiscountServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
