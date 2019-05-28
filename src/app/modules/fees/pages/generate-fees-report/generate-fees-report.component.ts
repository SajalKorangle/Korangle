import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { GenerateFeesReportServiceAdapter } from "./generate-fees-report.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'generate-fees-report',
    templateUrl: './generate-fees-report.component.html',
    styleUrls: ['./generate-fees-report.component.css'],
    providers: [ FeeService ],
})

export class GenerateFeesReportComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: GenerateFeesReportServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new GenerateFeesReportServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
