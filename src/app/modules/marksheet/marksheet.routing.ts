import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MarksheetComponent } from './marksheet.component';

const routes: Routes = [
    {
        path: '',
        component: MarksheetComponent,
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
export class MarksheetRoutingModule { }
