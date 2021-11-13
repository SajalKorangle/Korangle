import { NgModule } from '@angular/core';

import { SendSmsRoutingModule } from './send-sms.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { SendSmsComponent } from './send-sms.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
    declarations: [SendSmsComponent],

    imports: [SendSmsRoutingModule, ComponentsModule, NgxDatatableModule],
    exports: [],
    providers: [],
    bootstrap: [SendSmsComponent],
})
export class SendSmsModule {}
