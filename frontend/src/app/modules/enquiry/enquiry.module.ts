import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';

import { EnquiryComponent } from './enquiry.component';

import { EnquiryRoutingModule } from './enquiry.routing';

import { PrintEnquiryListComponent } from './print/print-enquiry-list/print-enquiry-list.component';

@NgModule({
    declarations: [EnquiryComponent, PrintEnquiryListComponent],

    imports: [ComponentsModule, EnquiryRoutingModule],
    exports: [],
    bootstrap: [EnquiryComponent],
})
export class EnquiryModule {}
