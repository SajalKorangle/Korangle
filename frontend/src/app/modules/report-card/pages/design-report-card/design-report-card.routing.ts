import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {DesignReportCardComponent} from './design-report-card.component';

const routes: Routes = [
    {
        path: '',
        component: DesignReportCardComponent ,
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
export class DesignReportCardRoutingModule { }
