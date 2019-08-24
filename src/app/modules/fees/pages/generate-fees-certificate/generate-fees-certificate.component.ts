import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { GenerateFeesCertificateServiceAdapter } from "./generate-fees-certificate.service.adapter";
import { FeeService } from "../../../../services/fees/fee.service";
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'generate-fees-certificate',
    templateUrl: './generate-fees-certificate.component.html',
    styleUrls: ['./generate-fees-certificate.component.css'],
    providers: [ FeeService ],
})

export class GenerateFeesCertificateComponent implements OnInit {

     user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: GenerateFeesCertificateServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new GenerateFeesCertificateServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
