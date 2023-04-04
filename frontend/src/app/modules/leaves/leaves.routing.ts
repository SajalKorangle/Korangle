import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LeavesComponent } from './leaves.component';
import { ManagePlanComponent } from './pages/manage_plan/manage_plan.component';

const routes: Routes = [
    {
        path: 'manage_type',
        loadChildren: 'app/modules/leaves/pages/manage_type/manage_type.module#ManageTypeModule',
        data: { moduleName: 'leaves' },
    },
    {
        path: 'manage_plan',
        component: ManagePlanComponent,
        data: { moduleName: 'leaves' },
    },
    {
        path: '',
        component: LeavesComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LeavesRoutingModule {}
