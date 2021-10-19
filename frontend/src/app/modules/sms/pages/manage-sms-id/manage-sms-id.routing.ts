import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageSmsIdComponent } from './manage-sms-id.component';

const routes: Routes = [
    {
        path: '',
        component: ManageSmsIdComponent ,
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
export class ManageSmsIdRouting { }
