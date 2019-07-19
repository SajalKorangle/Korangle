import { NgModule } from '@angular/core';

import { SendSmsRoutingModule} from './send-sms.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {SendSmsComponent} from "./send-sms.component";


@NgModule({
    declarations: [
        SendSmsComponent
    ],

    imports: [
        SendSmsRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [SendSmsComponent]
})
export class SendSmsModule { }
