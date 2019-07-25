import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ViewMarksheetComponent} from "./view-marksheet.component";

const routes: Routes = [
    {
        path: '',
        component: ViewMarksheetComponent ,
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
export class ViewMarksheetRoutingModule { }
