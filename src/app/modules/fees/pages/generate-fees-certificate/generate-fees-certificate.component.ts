import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { GenerateFeesCertificateServiceAdapter } from "./generate-fees-certificate.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'generate-fees-certificate',
    templateUrl: './generate-fees-certificate.component.html',
    styleUrls: ['./generate-fees-certificate.component.css'],
    providers: [ FeeService ],
})

export class GenerateFeesCertificateComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: GenerateFeesCertificateServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new GenerateFeesCertificateServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
