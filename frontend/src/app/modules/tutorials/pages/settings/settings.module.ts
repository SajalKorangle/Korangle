import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../../components/components.module';
import { SettingsRoutingModule } from './settings.routing';
import { SettingsComponent } from './settings.component';
import { MatProgressSpinnerModule } from '@angular/material';
import {ModuleComponentsModule} from '@modules/module-components/module-components.module';

@NgModule({
    declarations: [SettingsComponent],
    imports: [SettingsRoutingModule, ComponentsModule, MatProgressSpinnerModule, ModuleComponentsModule],
    providers: [],
    bootstrap: [SettingsComponent],
})
export class SettingsModule {}
