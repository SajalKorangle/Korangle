import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ApproveLeaveComponent } from './approve-leave.component';

const routes: Routes = [
    {
        path: '',
        component: ApproveLeaveComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApproveLeaveRoutingModule {}
