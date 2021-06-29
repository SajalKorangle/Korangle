import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ApplyLeaveComponent } from './apply-leave.component';

const routes: Routes = [
    {
        path: '',
        component: ApplyLeaveComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApplyLeaveRoutingModule {}
