import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { GivePermissionsComponent } from './give-permissions.component';

const routes: Routes = [
    {
        path: '',
        component: GivePermissionsComponent ,
    }
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
export class GivePermissionsRoutingModule { }
