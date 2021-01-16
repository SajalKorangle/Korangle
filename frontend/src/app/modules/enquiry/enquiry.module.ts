import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';

import { EnquiryComponent } from './enquiry.component';

import { EnquiryRoutingModule } from './enquiry.routing';

import { ClassService } from '../../services/modules/class/class.service';
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
    providers: [EnquiryOldService, ClassService],
    bootstrap: [EnquiryComponent]
})
export class EnquiryModule { }
