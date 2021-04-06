import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips'

import { SettingsRoutingModule,} from './settings.routing';
import {ComponentsModule} from "../../../../components/components.module";
import { SettingsComponent } from "./settings.component";


@NgModule({
    declarations: [
        SettingsComponent
    ],

    imports: [
        SettingsRoutingModule ,
        ComponentsModule,
        MatChipsModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [SettingsComponent]
})
export class SettingsModule { }
