import { NgModule } from '@angular/core';

import { ManageSmsIdComponent } from "./manage-sms-id.component";
import { ManageSmsIdRouting } from "./manage-sms-id.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        ManageSmsIdComponent,
    ],
    imports: [
        ManageSmsIdRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ ManageSmsIdComponent ]
})
export class ManageSmsIdModule { }
