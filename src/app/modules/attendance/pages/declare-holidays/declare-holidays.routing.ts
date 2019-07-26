import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {DeclareHolidaysComponent} from "./declare-holidays.component";

const routes: Routes = [
    {
        path: '',
        component: DeclareHolidaysComponent ,
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
export class DeclareHolidaysRoutingModule { }
