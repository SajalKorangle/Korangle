import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { GenerateFinalReportComponent } from './generate-final-report.component';

const routes: Routes = [
    {
        path: '',
        component: GenerateFinalReportComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GenerateFinalReporttRoutingModule {}
