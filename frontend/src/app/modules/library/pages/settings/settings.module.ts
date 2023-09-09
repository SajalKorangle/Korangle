import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRouting } from './settings.routing';
import { ComponentsModule } from "@components/components.module";



@NgModule({
    declarations: [SettingsComponent],
    imports: [
        CommonModule,
        SettingsRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [SettingsComponent]
})

export class SettingsModule { }
