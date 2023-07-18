import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AddComplaintComponent } from './add-complaint.component';

const routes: Routes = [
    {
        path: '',
        component: AddComplaintComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AddComplaintRoutingModule {}
