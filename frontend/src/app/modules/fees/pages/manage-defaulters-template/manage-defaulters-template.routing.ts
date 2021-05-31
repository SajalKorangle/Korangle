import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageDefaultersTemplateComponent } from './manage-defaulters-template.component';

const routes: Routes = [
    {
        path: '',
        component: ManageDefaultersTemplateComponent ,
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
export class ManageDefaultersTemplateRouting { }
