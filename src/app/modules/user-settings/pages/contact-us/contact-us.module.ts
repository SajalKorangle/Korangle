import { NgModule } from '@angular/core';

import {ContactUsRoutingModule} from './contact-us.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ContactUsComponent} from "./contact-us.component";


@NgModule({
    declarations: [
        ContactUsComponent
    ],

    imports: [
        ContactUsRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ContactUsComponent]
})
export class ContactUsModule { }
