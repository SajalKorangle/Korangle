import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ReportCardComponent } from './report-card.component';

const routes: Routes = [
    {
        path: 'design_report_card',
        loadChildren: 'app/modules/report-card-3/pages/design-report-card/design-report-card.module#DesignReportCardModule',
        data: {moduleName: 'report_card_3.0'}, // TODO: These should be called modulePath instead of moduleName everywhwere
    },
    {
        path: 'generate_report_card',
        loadChildren: 'app/modules/report-card-3/pages/generate-report-card/generate-report-card.module#GenerateReportCardModule',
        data: {moduleName: 'report_card_3.0'}, // TODO: These should be called modulePath instead of moduleName everywhwere
    },
    {
        path: '',
        component: ReportCardComponent,
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
export class ReportCardRoutingModule { }
