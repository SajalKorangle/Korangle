import { NgModule } from '@angular/core';
import {ComponentsModule} from "@components/components.module";
import {SmsEventSettingsComponent} from '@modules/sms/pages/sms-event-settings/sms-event-settings.component';
import {SmsEventSettingsRouting} from '@modules/sms/pages/sms-event-settings/sms-event-settings.routing';
import {ModuleComponentsModule} from '@modules/module-components/module-components.module';

@NgModule({
    declarations: [
        SmsEventSettingsComponent,
    ],
    imports: [
        SmsEventSettingsRouting,
        ComponentsModule,
        ModuleComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ SmsEventSettingsComponent ]
})
export class SmsEventSettingsModule { }
