import { Component, OnInit, OnDestroy } from '@angular/core';

import { EmitterService } from '../../services/emitter.service';

@Component({
    selector: 'app-print-transfer-certificate-second-format',
    templateUrl: './print-transfer-certificate-second-format.component.html',
    styleUrls: ['./print-transfer-certificate-second-format.component.css'],
})
export class PrintTransferCertificateSecondFormatComponent implements OnInit, OnDestroy {

    printTransferCertificateSecondFormatComponentSubscription: any;

    ngOnInit(): void {
        this.printTransferCertificateSecondFormatComponentSubscription = EmitterService.get('print-transfer-certificate-second-format-component').subscribe( value => {
            setTimeout(() => {
                window.print();
            });
        });
    }

    ngOnDestroy(): void {
        this.printTransferCertificateSecondFormatComponentSubscription.unsubscribe();
    }

}
