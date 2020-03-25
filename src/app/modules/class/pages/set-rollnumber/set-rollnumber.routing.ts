import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {SetRollnumberComponent} from './set-rollnumber.component';

const routes: Routes = [
    {
        path: '',
        component: SetRollnumberComponent ,
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
export class SetRollnumberRoutingModule { }
