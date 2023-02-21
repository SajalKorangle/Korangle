import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Salary2Component } from './salary2.component';

const routes: Routes = [
    {
        path: 'design_payslip',
        loadChildren: 'app/modules/salary2/pages/design_payslip/design-payslip.module#DesignPayslipModule',
        data: { moduleName: 'salary2' },
    },

    {
        path: '',
        component: Salary2Component,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Salary2RoutingModule {}
