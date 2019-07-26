import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { UserSettingsComponent } from './user-settings.component';

import { UserSettingsRoutingModule } from './user-settings.routing';

@NgModule({
    declarations: [

        UserSettingsComponent,

    ],

    imports: [

        ComponentsModule,
        UserSettingsRoutingModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [UserSettingsComponent]
})
export class UserSettingsModule { }
