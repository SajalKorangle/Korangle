import { NgModule } from '@angular/core';
import {ComponentsModule} from "@components/components.module";
import {SmsEventSettingsComponent} from '@modules/sms/pages/manage-templates/sms-event-settings.component';
import {SmsEventSettingsRouting} from '@modules/sms/pages/manage-templates/sms-event-settings.routing';

@NgModule({
    declarations: [
        SmsEventSettingsComponent,
    ],
    imports: [
        SmsEventSettingsRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ SmsEventSettingsComponent ]
})
export class SmsEventSettingsModule { }
