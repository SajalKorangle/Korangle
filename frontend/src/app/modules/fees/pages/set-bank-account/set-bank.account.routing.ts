import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SetBankAccountComponent } from "./set-bank-account.component";

const routes: Routes = [
    {
        path: '',
        component: SetBankAccountComponent,
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
export class SetBankAccountRoutingModule { }
