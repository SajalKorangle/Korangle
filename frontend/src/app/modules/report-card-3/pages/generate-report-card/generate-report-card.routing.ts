import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { GenerateReportCardComponent} from './generate-report-card.component'

const routes: Routes = [
    {
        path: '',
        component: GenerateReportCardComponent
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
export class GenerateReportCardRouting { }
