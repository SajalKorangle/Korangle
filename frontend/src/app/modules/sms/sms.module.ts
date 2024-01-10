import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../components/components.module';

import { SmsComponent } from './sms.component';

import { SmsRoutingModule } from './sms.routing';

import { SmsOldService } from '../../services/modules/sms/sms-old.service';

@NgModule({
    declarations: [
        SmsComponent,
    ],
    imports: [ComponentsModule, SmsRoutingModule, NgxDatatableModule],
    exports: [],
    providers: [SmsOldService],
    bootstrap: [SmsComponent],
})
export class SmsModule { }
