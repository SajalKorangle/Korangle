import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';
import {StudentTcProfile} from '../../classes/student-tc-profile';

@Component({
    selector: 'app-print-transfer-certificate-second-format',
    templateUrl: './print-transfer-certificate-second-format.component.html',
    styleUrls: ['./print-transfer-certificate-second-format.component.css'],
})
export class PrintTransferCertificateSecondFormatComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    viewChecked = true;

    studentTcProfile: StudentTcProfile;

    printTransferCertificateSecondFormatComponentSubscription: any;

    ngOnInit(): void {
        this.printTransferCertificateSecondFormatComponentSubscription = EmitterService.get('print-transfer-certificate-second-format-component').subscribe( value => {
            this.studentTcProfile = value;
            this.viewChecked = false;
        });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.studentTcProfile = null;
        }
    }

    ngOnDestroy(): void {
        this.printTransferCertificateSecondFormatComponentSubscription.unsubscribe();
        this.studentTcProfile = null;
    }

}
