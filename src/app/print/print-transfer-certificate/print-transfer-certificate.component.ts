import { Component, OnInit, OnDestroy } from '@angular/core';

// import { Marksheet } from '../../classes/marksheet';

import { EmitterService } from '../../services/emitter.service';

@Component({
    selector: 'app-print-transfer-certificate',
    templateUrl: './print-transfer-certificate.component.html',
    styleUrls: ['./print-transfer-certificate.component.css'],
})
export class PrintTransferCertificateComponent implements OnInit, OnDestroy {

    totalMarks: number;

    printTransferCertificateComponentSubscription: any;

    ngOnInit(): void {
        this.printTransferCertificateComponentSubscription = EmitterService.get('print-transfer-certificate-component').subscribe( value => {
            setTimeout(() => {
                window.print();
            });
        });
    }

    ngOnDestroy(): void {
        this.printTransferCertificateComponentSubscription.unsubscribe();
    }

}
