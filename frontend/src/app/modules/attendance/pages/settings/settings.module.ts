import { NgModule } from '@angular/core';

import { SettingsComponent } from "./settings.component";
import { SettingsRoutingModule } from "./settings.routing"
import {ComponentsModule} from "../../../../components/components.module";

@NgModule({
    declarations: [
        SettingsComponent
    ],

    imports: [
        SettingsRoutingModule,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [SettingsComponent]
})
export class SettingsModule { }