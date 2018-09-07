import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';
import { TransferCertificate } from '../../classes/transfer-certificate';
import {MEDIUM_LIST} from '../../../../classes/constants/medium';

@Component({
    selector: 'app-print-transfer-certificate-second-format',
    templateUrl: './print-transfer-certificate-second-format.component.html',
    styleUrls: ['./print-transfer-certificate-second-format.component.css'],
})
export class PrintTransferCertificateSecondFormatComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    mediumList = MEDIUM_LIST;

    viewChecked = true;

    studentProfile: any;

    transferCertificate: TransferCertificate = new TransferCertificate();

    numberOfCopies = 1;

    printTransferCertificateSecondFormatComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.printTransferCertificateSecondFormatComponentSubscription = EmitterService.get('print-transfer-certificate-second-format-component').subscribe( value => {
            this.studentProfile = value.studentProfile;
            this.transferCertificate.copy(value.transferCertificate);
            if(value.twoCopies) {
                this.numberOfCopies = 2;
            } else {
                this.numberOfCopies = 1;
            }
            this.viewChecked = false;
        });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.studentProfile = null;
            this.transferCertificate.clean();
            this.numberOfCopies = 1;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printTransferCertificateSecondFormatComponentSubscription.unsubscribe();
        this.studentProfile = null;
        this.transferCertificate.clean();
    }

}
