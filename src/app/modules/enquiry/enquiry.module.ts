import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';

import { EnquiryComponent } from './enquiry.component';

import { EnquiryRoutingModule } from './enquiry.routing';

import { ClassOldService } from '../../services/modules/class/class-old.service';
import { EnquiryOldService } from '../../services/modules/enquiry/enquiry-old.service';
import { PrintEnquiryListComponent } from "./print/print-enquiry-list/print-enquiry-list.component";

@NgModule({
    declarations: [

        EnquiryComponent,
        PrintEnquiryListComponent

    ],

    imports: [

        ComponentsModule,
        EnquiryRoutingModule,

    ],
    exports: [
    ],
    providers: [EnquiryOldService, ClassOldService],
    bootstrap: [EnquiryComponent]
})
export class EnquiryModule { }
