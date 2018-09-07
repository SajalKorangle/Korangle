import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UserSettingsComponent } from './user-settings.component';

const routes: Routes = [
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
