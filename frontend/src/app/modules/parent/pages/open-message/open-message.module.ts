import { NgModule } from '@angular/core';

import { OpenMessageComponent } from "./open-message.component";
import { OpenMessageRouting } from "./open-message.routing";
import { ComponentsModule } from "@components/components.module";

@NgModule({
    declarations: [
        OpenMessageComponent,
    ],
    imports: [
        OpenMessageRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ OpenMessageComponent ]
})
export class OpenMessageModule { }
