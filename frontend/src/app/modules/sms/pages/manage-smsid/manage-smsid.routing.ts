import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageSmsidComponent } from './manage-smsid.component';

const routes: Routes = [
    {
        path: '',
        component: ManageSmsidComponent ,
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
export class ManageSmsidRouting { }
