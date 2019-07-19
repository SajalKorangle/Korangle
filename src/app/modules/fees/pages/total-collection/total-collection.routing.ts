import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {TotalCollectionComponent} from "./total-collection.component";

const routes: Routes = [
    {
        path: '',
        component: TotalCollectionComponent ,
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
export class TotalCollectionRoutingModule { }
