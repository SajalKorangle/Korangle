import { NgModule } from '@angular/core';

import { SendSmsRoutingModule} from './send-sms.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {SendSmsComponent} from "./send-sms.component";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PurchaseSMSDialogComponent } from "./send-sms.component";


@NgModule({
    declarations: [
        SendSmsComponent,
        PurchaseSMSDialogComponent,
    ],

    imports: [
        SendSmsRoutingModule ,
        ComponentsModule,
        NgxDatatableModule

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [SendSmsComponent, PurchaseSMSDialogComponent],
    entryComponents: [SendSmsComponent ,PurchaseSMSDialogComponent]

})
export class SendSmsModule { }
