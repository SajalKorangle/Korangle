import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { EnquiryComponent } from './enquiry.component';

import { AddEnquiryComponent } from './pages/add-enquiry/add-enquiry.component';
import { ViewAllComponent } from './pages/view-all/view-all.component';
import { UpdateEnquiryComponent } from './pages/update-enquiry/update-enquiry.component';

import { EnquiryRoutingModule } from './enquiry.routing';

import { ClassService } from '../../services/class.service';
import { EnquiryService } from './enquiry.service';

@NgModule({
    declarations: [

        EnquiryComponent,

        AddEnquiryComponent,
        ViewAllComponent,
        UpdateEnquiryComponent,

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
