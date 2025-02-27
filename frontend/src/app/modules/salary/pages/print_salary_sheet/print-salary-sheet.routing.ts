import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PrintSalarySheetComponent } from './print-salary-sheet.component';

const routes: Routes = [
    {
        path: '',
        component: PrintSalarySheetComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PrintSalarySheetRoutingModule {}
