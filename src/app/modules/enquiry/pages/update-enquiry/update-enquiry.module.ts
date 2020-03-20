import { NgModule } from '@angular/core';

import { UpdateEnquiryComponent } from "./update-enquiry.component";

import {UpdateEnquiryRoutingModule} from './update-enquiry.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [

        UpdateEnquiryComponent,

    ],

    imports: [

        UpdateEnquiryRoutingModule,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [UpdateEnquiryComponent]
})
export class UpdateEnquiryModule { }
