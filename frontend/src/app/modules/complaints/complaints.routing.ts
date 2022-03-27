import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ComplaintsComponent } from './complaints.component';
import { PrintCountAllTableComplaintsComponent } from './print/print-count-all-table-complaints/print-count-all-table-complaints.component';
import { PRINT_COUNT_ALL_TABLE_COMPLAINTS } from '../../print/print-routes.constants';

const routes: Routes = [
    {
        path: 'manage_complaint_type',
        loadChildren: 'app/modules/complaints/pages/manage-complaint-type/manage-complaint-type.module#ManageComplaintTypeModule',
        data: { moduleName: 'complaints' },
    },
    {
        path: 'manage_complaints',
        loadChildren: 'app/modules/complaints/pages/manage-complaints/manage-complaints.module#ManageComplaintsModule',
        data: { moduleName: 'complaints' },
    },
    {
        path: 'count_all',
        loadChildren: 'app/modules/complaints/pages/count-all/count-all.module#CountAllModule',
        data: { moduleName: 'complaints' },
    },
    {
        path: 'add_complaint',
        loadChildren: 'app/modules/complaints/pages/add-complaint/add-complaint.module#AddComplaintModule',
        data: { moduleName: 'complaints' },
    },
    {
        path: '',
        component: ComplaintsComponent,
    },
    {
        path: PRINT_COUNT_ALL_TABLE_COMPLAINTS,
        component: PrintCountAllTableComplaintsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ComplaintsRoutingModule {}
