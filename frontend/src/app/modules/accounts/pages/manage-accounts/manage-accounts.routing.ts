import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageAccountsComponent } from './manage-accounts.component';

const routes: Routes = [
    {
        path: '',
        component: ManageAccountsComponent ,
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
export class ManageAccountsRoutingModule { }