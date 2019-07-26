import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {PrintMarksheetComponent} from "./print-marksheet.component";

const routes: Routes = [
    {
        path: '',
        component: PrintMarksheetComponent ,
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
export class PrintMarksheetRoutingModule { }
