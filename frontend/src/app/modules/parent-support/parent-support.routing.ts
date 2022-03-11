import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ParentSupportComponent } from './parent-support.component';
import { PrintCountAllTableParentSupportComponent } from './print/print-count-all-table-parent-support/print-count-all-table-parent-support.component';
import { PRINT_COUNT_ALL_TABLE_PARENT_SUPPORT } from '../../print/print-routes.constants';

const routes: Routes = [
    {
        path: 'manage_complaint_type',
        loadChildren: 'app/modules/parent-support/pages/manage-complaint-type/manage-complaint-type.module#ManageComplaintTypeModule',
        data: { moduleName: 'parent-support' },
    },
    {
        path: 'manage_complaints',
        loadChildren: 'app/modules/parent-support/pages/manage-complaints/manage-complaints.module#ManageComplaintsModule',
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
    {
        path: PRINT_COUNT_ALL_TABLE_PARENT_SUPPORT,
        component: PrintCountAllTableParentSupportComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParentSupportRoutingModule {}
