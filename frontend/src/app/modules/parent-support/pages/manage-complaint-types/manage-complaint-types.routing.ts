import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageComplaintTypesComponent } from './manage-complaint-types.component';

const routes: Routes = [
    {
        path: '',
        component: ManageComplaintTypesComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManageComplaintTypesRoutingModule {}
