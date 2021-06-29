import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ChangeSessionComponent } from './change-session.component';

const routes: Routes = [
    {
        path: '',
        component: ChangeSessionComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChangeSessionRoutingModule {}
