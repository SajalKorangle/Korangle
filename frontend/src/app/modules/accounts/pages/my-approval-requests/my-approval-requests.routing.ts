import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MyApprovalRequestsComponent } from './my-approval-requests.component';

const routes: Routes = [
    {
        path: '',
        component: MyApprovalRequestsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyApprovalRequestsRoutingModule {}
