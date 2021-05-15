import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../../components/components.module';
import { SettingsRoutingModule } from './settings.routing';
import { SettingsComponent } from './settings.component';
import { MatProgressSpinnerModule } from '@angular/material';
import {MentionsModule} from '@flxng/mentions';


@NgModule({
    declarations: [SettingsComponent],
    imports: [SettingsRoutingModule, ComponentsModule, MatProgressSpinnerModule, MentionsModule],
    providers: [],
    bootstrap: [SettingsComponent],
})
export class SettingsModule {}
