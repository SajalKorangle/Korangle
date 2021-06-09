import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ChangeClassComponent } from './change-class.component';

const routes: Routes = [
    {
        path: '',
        component: ChangeClassComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChangeClassRoutingModule {}
