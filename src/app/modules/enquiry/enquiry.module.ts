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
import {DeleteEnquiryComponent} from "./pages/delete-enquiry/delete-enquiry.component";

@NgModule({
    declarations: [

        EnquiryComponent,

        AddEnquiryComponent,
        ViewAllComponent,
        UpdateEnquiryComponent,
        DeleteEnquiryComponent,
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
