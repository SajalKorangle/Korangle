import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { GenerateFeesCertificateServiceAdapter } from "./generate-fees-certificate.service.adapter";
import { FeeService } from "../../../../services/modules/fees/fee.service";
import {PrintService} from "../../../../print/print-service";
import { PRINT_FEES_CERTIFICATE } from '../../print/print-routes.constants';
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

    isStudentListLoading = false;
    selectedStudent: any;
    boardList: any;

    constructor(public printService: PrintService,
                public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new GenerateFeesCertificateServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    handleDetailsFromParentStudentFilter(details: any){

    }

    handleStudentListSelection(selectedStudentList: any){

    }

    printFeesCertificate(){
        const value = {
            studentProfile: this.selectedStudent,
            //transferCertificate: this.selectedTransferCertificate,
            boardList: this.boardList,
            //twoCopies: this.twoCopies,
        };
        this.printService.navigateToPrintRoute(PRINT_FEES_CERTIFICATE, {user: this.user, value});
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

}
