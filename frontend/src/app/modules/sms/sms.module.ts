import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../components/components.module';

import { SmsComponent } from './sms.component';

import { SendSmsComponent } from './pages/send-sms/send-sms.component';
import { ViewSentComponent } from './pages/view-sent/view-sent.component';
import { ViewPurchasesComponent } from './pages/view-purchases/view-purchases.component';

import { SmsRoutingModule } from './sms.routing';

import { SmsOldService } from '../../services/modules/sms/sms-old.service';

@NgModule({
    declarations: [
        SmsComponent,

        // SendSmsComponent,
        // ViewSentComponent,
        // ViewPurchasesComponent,
    ],

    imports: [ComponentsModule, SmsRoutingModule, NgxDatatableModule],
    exports: [],
    providers: [SmsOldService],
    bootstrap: [SmsComponent],
})
export class SmsModule {}
