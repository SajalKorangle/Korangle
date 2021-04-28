import { NgModule } from '@angular/core';

import { ManageSmsidComponent } from "./manage-smsid.component";
import { ManageSmsidRouting } from "./manage-smsid.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        ManageSmsidComponent,
    ],
    imports: [
        ManageSmsidRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ ManageSmsidComponent ]
})
export class PageNameModule { }
