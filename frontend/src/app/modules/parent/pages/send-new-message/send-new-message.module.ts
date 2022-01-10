import { NgModule } from '@angular/core';

import { SendNewMessageComponent } from "./send-new-message.component";
import { SendNewMessageRouting } from "./send-new-message.routing";
import { ComponentsModule } from "@components/components.module";

@NgModule({
    declarations: [
        SendNewMessageComponent,
    ],
    imports: [
        SendNewMessageRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ SendNewMessageComponent ]
})
export class SendNewMessageModule { }
