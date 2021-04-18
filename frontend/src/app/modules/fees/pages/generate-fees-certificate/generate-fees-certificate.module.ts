import { NgModule } from '@angular/core';

import { GenerateFeesCertificateRoutingModule } from './generate-fees-certificate.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { GenerateFeesCertificateComponent } from './generate-fees-certificate.component';

@NgModule({
    declarations: [GenerateFeesCertificateComponent],

    imports: [GenerateFeesCertificateRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [GenerateFeesCertificateComponent],
})
export class GenerateFeesCertificateModule {}
