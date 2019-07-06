import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { TransferCertificate } from '../../classes/transfer-certificate';
import {MEDIUM_LIST} from '../../../../classes/constants/medium';
import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-transfer-certificate-second-format.component.html',
    styleUrls: ['./print-transfer-certificate-second-format.component.css'],
})
export class PrintTransferCertificateSecondFormatComponent implements OnInit, OnDestroy, AfterViewChecked {

    user: any;

    mediumList = MEDIUM_LIST;

    viewChecked = true;

    studentProfile: any;

    transferCertificate: TransferCertificate = new TransferCertificate();

    numberOfCopies = 1;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }

    ngOnInit(): void {
        const {user, value} = this.printService.getData();
        this.user = user;
        this.studentProfile = value.studentProfile;
        this.transferCertificate.copy(value.transferCertificate);
        if(value.twoCopies) {
            this.numberOfCopies = 2;
        } else {
            this.numberOfCopies = 1;
        }
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.studentProfile = null;
            this.transferCertificate.clean();
            this.numberOfCopies = 1;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.studentProfile = null;
        this.transferCertificate.clean();
    }

}
