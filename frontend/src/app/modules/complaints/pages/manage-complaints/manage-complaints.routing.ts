import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageComplaintsComponent } from './manage-complaints.component';

const routes: Routes = [
    {
        path: '',
        component: ManageComplaintsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManageComplaintsRoutingModule {}
