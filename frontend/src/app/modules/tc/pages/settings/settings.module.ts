import { NgModule } from '@angular/core';

import { SettingsRoutingModule } from './settings.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { SettingsComponent } from "./settings.component";


@NgModule({
    declarations: [
        SettingsComponent
    ],

    imports: [
        SettingsRoutingModule,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [SettingsComponent]
})
export class SettingsModule { }
