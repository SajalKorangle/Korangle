import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IdCardComponent } from './id-card.component';

const routes: Routes = [
    {
        path: 'manage_layouts',
        loadChildren: 'app/modules/id-card/pages/manage-layouts/manage-layouts.module#ManageLayoutsModule',
        data: {moduleName: 'id_card'},
    },
    {
        path: 'generate_id_card',
        loadChildren: 'app/modules/id-card/pages/generate-id-card/generate-id-card.module#GenerateIdCardModule',
        data: {moduleName: 'fees'},
    },
    {
        path: '',
        component: IdCardComponent,
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
export class IdCardRoutingModule { }