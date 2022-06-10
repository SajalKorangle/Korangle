import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageComplaintTypeComponent } from './manage-complaint-type.component';

const routes: Routes = [
    {
        path: '',
        component: ManageComplaintTypeComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManageComplaintTypeRoutingModule {}
