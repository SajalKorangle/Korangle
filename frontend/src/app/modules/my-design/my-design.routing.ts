import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MyDesignComponent } from './my-design.component';

const routes: Routes = [
    {
        path: 'design_layout',
        loadChildren: 'app/modules/my-design/pages/design-layout/design-layout.module#DesignLayoutModule',
        data: { moduleName: 'my_design' }, // TODO: These should be called modulePath instead of moduleName everywhwere
    },
    // {
    //     path: 'generate_report_card',
    //     loadChildren: 'app/modules/report-card-3/pages/generate-report-card/generate-report-card.module#GenerateReportCardModule',
    //     data: { moduleName: 'report_card_3.0' }, // TODO: These should be called modulePath instead of moduleName everywhwere
    // },
    {
        path: '',
        component: MyDesignComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportCardRoutingModule { }
