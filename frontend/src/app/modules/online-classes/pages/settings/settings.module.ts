import { NgModule } from '@angular/core';

import { SettingsComponent } from "./settings.component";
import { SettingsRouting } from "./settings.routing";
import { ComponentsModule } from "@components/components.module";
import { LocalComponentsModule } from '@modules/online-classes/components/local-components.module';

import { NewOnlineClassDialogComponent } from '@modules/online-classes/components/new-online-class-dialog/new-online-class-dialog.component';

@NgModule({
    declarations: [
        SettingsComponent,
    ],
    imports: [
        SettingsRouting,
        ComponentsModule,
        LocalComponentsModule
    ],
    entryComponents: [NewOnlineClassDialogComponent],
    exports: [],
    providers: [],
    bootstrap: [SettingsComponent]
})
export class SettingsModule { }
