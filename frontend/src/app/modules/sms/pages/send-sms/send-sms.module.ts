import { NgModule } from '@angular/core';

import { SendSmsRoutingModule } from './send-sms.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { SendSmsComponent } from './send-sms.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PurchaseSmsDialogComponent } from './components/purchase-sms-dialog/purchase-sms-dialog.component';
import { PurchaseSmsDialogEasebuzzComponent } from './components/purchase-sms-dialog-easebuzz/purchase-sms-dialog-easebuzz.component';

@NgModule({
    declarations: [
        SendSmsComponent,
        PurchaseSmsDialogComponent,
        PurchaseSmsDialogEasebuzzComponent
    ],

    imports: [
        SendSmsRoutingModule,
        ComponentsModule,
        NgxDatatableModule
    ],
    exports: [],
    providers: [],
    entryComponents: [
        PurchaseSmsDialogComponent,
        PurchaseSmsDialogEasebuzzComponent
    ],
    bootstrap: [SendSmsComponent],
})
export class SendSmsModule { }
