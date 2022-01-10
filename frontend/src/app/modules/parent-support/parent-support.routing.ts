import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ParentSupportComponent } from './parent-support.component';

const routes: Routes = [
    {
        path: 'manage_complaint_types',
        loadChildren: 'app/modules/parent-support/pages/manage-complaint-types/manage-complaint-types.module#ManageComplaintTypesModule',
        data: { moduleName: 'parent-support' },
    },
    {
        path: 'manage_all_complaints',
        loadChildren: 'app/modules/parent-support/pages/manage-all-complaints/manage-all-complaints.module#ManageAllComplaintsModule',
        data: { moduleName: 'parent-support' },
    },
    {
        path: 'count_all',
        loadChildren: 'app/modules/parent-support/pages/count-all/count-all.module#CountAllModule',
        data: { moduleName: 'parent-support' },
    },
    {
        path: 'add_complaint',
        loadChildren: 'app/modules/parent-support/pages/add-complaint/add-complaint.module#AddComplaintModule',
        data: { moduleName: 'parent-support' },
    },
    {
        path: '',
        component: ParentSupportComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParentSupportRoutingModule {}
