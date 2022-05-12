import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UserSettingsComponent } from './user-settings.component';

const routes: Routes = [
    {
        path: 'update_profile',
        loadChildren: 'app/modules/user-settings/pages/update-profile/update-profile.module#UpdateProfileModule',
        data: { moduleName: 'user-settings' },
    },
    {
        path: 'change_password',
        loadChildren: 'app/modules/user-settings/pages/change-password/change-password.module#ChangePasswordModule',
        data: { moduleName: 'user-settings' },
    },
    {
        path: 'create_school',
        loadChildren: 'app/modules/user-settings/pages/create-school/create-school.module#CreateSchoolModule',
        data: { moduleName: 'user-settings' },
    },
    {
        path: 'contact_us',
        loadChildren: 'app/modules/user-settings/pages/contact-us/contact-us.module#ContactUsModule',
        data: { moduleName: 'user-settings' },
    },
    {
        path: 'suggest_feature',
        loadChildren: 'app/modules/user-settings/pages/suggest-feature/suggest-feature.module#SuggestFeatureModule',
        data: { moduleName: 'user-settings' },
    },
    {
        path: 'view_devices',
        loadChildren: 'app/modules/user-settings/pages/view-devices/view-devices.module#ViewDevicesModule',
        data: { moduleName: 'user-settings' },
    },
    {
        path: '',
        component: UserSettingsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserSettingsRoutingModule {}
