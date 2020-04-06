import { NgModule } from '@angular/core';

import { AddEnquiryComponent } from "./add-enquiry.component";

import {AddEnquiryRoutingModule} from './add-enquiry.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [

        AddEnquiryComponent,

    ],

    imports: [

        AddEnquiryRoutingModule,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AddEnquiryComponent]
})
export class AddEnquiryModule { }
