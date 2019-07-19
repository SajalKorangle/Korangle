import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SchoolComponent } from './school.component';

const routes: Routes = [
    {
        path: 'update_profile',
        loadChildren: 'app/modules/school/pages/update-profile/update-profile.module#UpdateProfileModule',
        data: {moduleName: 'school'},
    },
    {
        path: '',
        component: SchoolComponent,
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
export class SchoolRoutingModule { }
