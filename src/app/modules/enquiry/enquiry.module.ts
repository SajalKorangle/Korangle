import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { EnquiryComponent } from './enquiry.component';

import { AddEnquiryComponent } from './pages/add-enquiry/add-enquiry.component';
import { ViewAllComponent } from './pages/view-all/view-all.component';
import { UpdateEnquiryComponent } from './pages/update-enquiry/update-enquiry.component';

import { EnquiryRoutingModule } from './enquiry.routing';

import { ClassService } from '../../services/class.service';
import { EnquiryService } from './enquiry.service';
import {PrintEnquiryListComponent} from "./print/print-enquiry-list/print-enquiry-list.component";

@NgModule({
    declarations: [

        EnquiryComponent,

        AddEnquiryComponent,
        ViewAllComponent,
        UpdateEnquiryComponent,
        PrintEnquiryListComponent

    ],

    imports: [

        ComponentsModule,
        EnquiryRoutingModule,
        EnquiryRoutingModule

    ],
    exports: [
    ],
    providers: [EnquiryService, ClassService],
    bootstrap: [EnquiryComponent]
})
export class EnquiryModule { }
