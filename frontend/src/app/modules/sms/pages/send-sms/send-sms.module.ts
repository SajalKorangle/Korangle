import { NgModule } from '@angular/core';

import { SendSmsRoutingModule } from './send-sms.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { SendSmsComponent } from './send-sms.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PurchaseSmsDialogComponent } from './components/purchase-sms-dialog/purchase-sms-dialog.component';

@NgModule({
    declarations: [
        SendSmsComponent,
        PurchaseSmsDialogComponent,
    ],

    imports: [
        SendSmsRoutingModule,
        ComponentsModule,
        NgxDatatableModule
    ],
    exports: [],
    providers: [],
    entryComponents: [PurchaseSmsDialogComponent],
    bootstrap: [SendSmsComponent],
})
export class SendSmsModule { }
