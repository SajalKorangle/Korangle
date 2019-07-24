import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UserSettingsComponent } from './user-settings.component';

const routes: Routes = [

    {
        path: 'update_profile',
        loadChildren: 'app/modules/user-settings/update-profile/update-profile.module#UpdateProfileModule',
        data: {moduleName: 'user-settings'},
    },
    {
        path: 'change_password',
        loadChildren: 'app/modules/user-settings/change-password/change-password.module#ChangePasswordModule',
        data: {moduleName: 'user-settings'},
    },
    {
        path: 'create_school',
        loadChildren: 'app/modules/user-settings/create-school/create-school.module#CreateSchoolModule',
        data: {moduleName: 'user-settings'},
    },
    {
        path: 'contact_us',
        loadChildren: 'app/modules/user-settings/contact-us/contact-us.module#ContactUsModule',
        data: {moduleName: 'user-settings'},
    },

    {
        path: '',
        component: UserSettingsComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ],
})
export class UserSettingsRoutingModule { }
