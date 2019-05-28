import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { ViewDefaultersServiceAdapter } from "./view-defaulters.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'view-defaulters',
    templateUrl: './view-defaulters.component.html',
    styleUrls: ['./view-defaulters.component.css'],
    providers: [ FeeService ],
})

export class ViewDefaultersComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: ViewDefaultersServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new ViewDefaultersServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
