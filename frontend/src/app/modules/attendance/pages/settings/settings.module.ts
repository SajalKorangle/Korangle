import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings.routing';
import { ComponentsModule } from '../../../../components/components.module';
import {ModuleComponentsModule} from '@modules/module-components/module-components.module';

@NgModule({
    declarations: [SettingsComponent],

    imports: [SettingsRoutingModule, ComponentsModule, ModuleComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [SettingsComponent],
})
export class SettingsModule {}
