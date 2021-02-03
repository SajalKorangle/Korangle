import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ScheduleTestComponent} from "./schedule-test.component";

const routes: Routes = [
    {
        path: '',
        component: ScheduleTestComponent ,
        
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
export class ScheduleTestRoutingModule { }
