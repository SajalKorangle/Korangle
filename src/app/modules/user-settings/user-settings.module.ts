import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { UserSettingsComponent } from './user-settings.component';

import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CreateSchoolComponent } from './create-school/create-school.component';

import { UserSettingsRoutingModule } from './user-settings.routing';

@NgModule({
    declarations: [

        UserSettingsComponent,

        // UpdateProfileComponent,
        // ChangePasswordComponent,
        // ContactUsComponent,
        // CreateSchoolComponent,

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
