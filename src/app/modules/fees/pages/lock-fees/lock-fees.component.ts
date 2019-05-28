import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { LockFeesServiceAdapter } from "./lock-fees.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'lock-fees',
    templateUrl: './lock-fees.component.html',
    styleUrls: ['./lock-fees.component.css'],
    providers: [ FeeService ],
})

export class LockFeesComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: LockFeesServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new LockFeesServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
