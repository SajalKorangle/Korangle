import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LeavesComponent } from './leaves.component';

const routes: Routes = [
    {
        path: 'manage_type',
        loadChildren: 'app/modules/leaves/pages/manage_type/manage_type.module#ManageTypeModule',
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
