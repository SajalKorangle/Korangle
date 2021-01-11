import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ViewTutorialsComponent} from '@modules/parent/pages/view-tutorials/view-tutorials.component';

const routes: Routes = [
    {
        path: '',
        component: ViewTutorialsComponent ,
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
export class ViewTutorialsRoutingModule { }
