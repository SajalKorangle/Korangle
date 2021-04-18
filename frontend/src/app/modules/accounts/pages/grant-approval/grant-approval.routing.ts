import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { GrantApprovalComponent } from './grant-approval.component';

const routes: Routes = [
    {
        path: '',
        component: GrantApprovalComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GrantApprovalRoutingModule {}
