import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Salary2Component } from './salary2.component';

const routes: Routes = [
    {
        path: 'design_payslip',
        loadChildren: 'app/modules/salary2/pages/placeholder/placeholder.module#PlaceHolderModule',
        data: { moduleName: 'salary2' },
    },
    {
        path: 'generate_payslip',
        loadChildren: 'app/modules/salary2/pages/placeholder/placeholder.module#PlaceHolderModule',
        data: { moduleName: 'salary2' },
    },
    {
        path: 'manage_payslips',
        loadChildren: 'app/modules/salary2/pages/placeholder/placeholder.module#PlaceHolderModule',
        data: { moduleName: 'salary2' },
    },
    {
        path: 'generate_salary_sheet',
        loadChildren: 'app/modules/salary2/pages/placeholder/placeholder.module#PlaceHolderModule',
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
