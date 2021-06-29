import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IssueTCComponent } from './issue-tc.component';

const routes: Routes = [
    {
        path: '',
        component: IssueTCComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IssueTCRoutingModule {}
