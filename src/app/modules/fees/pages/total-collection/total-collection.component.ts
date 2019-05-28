import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { TotalCollectionServiceAdapter } from "./total-collection.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'total-collection',
    templateUrl: './total-collection.component.html',
    styleUrls: ['./total-collection.component.css'],
    providers: [ FeeService ],
})

export class TotalCollectionComponent implements OnInit {

    @Input() user;

    selectedClass: any;

    serviceAdapter: TotalCollectionServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new TotalCollectionServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
