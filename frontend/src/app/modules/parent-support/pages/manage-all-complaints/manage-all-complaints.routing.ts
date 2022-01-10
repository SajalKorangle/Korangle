import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageAllComplaintsComponent } from './manage-all-complaints.component';

const routes: Routes = [
    {
        path: '',
        component: ManageAllComplaintsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManageAllComplaintsRoutingModule {}
