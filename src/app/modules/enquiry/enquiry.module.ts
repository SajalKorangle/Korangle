import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';

import { EnquiryComponent } from './enquiry.component';

import { EnquiryRoutingModule } from './enquiry.routing';

import { ClassService } from '../../services/class.service';
import { EnquiryService } from './enquiry.service';
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
    providers: [EnquiryService, ClassService],
    bootstrap: [EnquiryComponent]
})
export class EnquiryModule { }
